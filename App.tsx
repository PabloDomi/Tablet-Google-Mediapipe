import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { startPoseLandmarker } from './modules/tabletMediapipe'
import React, { useEffect, useState } from 'react';
import Tablet_mediapipeView from './modules/tabletMediapipe/src/tablet_mediapipeView';
import useHealthData from './src/hooks/useHealthData';
import useGenerateLandmarksToSend from './src/hooks/useGenerateLandmarksToSend';
import sendPatientData from './src/services/sendPatientData';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './src/css/styles';
import { CheckTabletTypes } from './src/utils/types';
import LoginScreen from './src/components/LoginScreen';
import RoutineScreen from './src/components/RoutineScreen';
import getPatientData from './src/services/getPatientData';
import useCheckDate from './src/hooks/useCheckDate';
import usePersistentState from './src/hooks/usePersistentState';
// import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {

  const {
    isAuthenticated,
    setIsAuthenticated,
    tabletNumber,
    setTabletNumber,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    isRoutineButtonEnabled,
    setIsRoutineButtonEnabled,
    patientData,
    setPatientData,
    exercisesThisWeek,
    setExercisesThisWeek,
    routine,
    setRoutine,
    clearPersistentData
  } = usePersistentState();


  // Controla la visibilidad de la cámara
  const [showMediapipe, setShowMediapipe] = useState<boolean>(false);

  // Landmarks para enviar a la API
  const [landmarks, setLandmarks] = useState<string[]>([]);

  // Fecha actual para enviar a la API
  const [date, setDate] = useState<Date>(new Date());

  // Health Connect data
  const { steps, flights, distance, readData } = useHealthData(date)

  // Controla que la lectura de Health Connect se haga después de la primera lectura de landmarks
  const [flagHC, setFlagHC] = useState<boolean>(false)

  // Estado de comienzo de rutina
  const [routineStarted, setRoutineStarted] = useState<boolean>(false);

  // Estado para los desplegables de los ejercicios
  const [activeSections, setActiveSections] = useState<string[]>([]);


  /*
    TODO:           
      6. (Calentada) mostrar una barra de progreso según se van realizando los ejercicios? (opcional)
      7. Intentar de alguna manera añadir datos a la aplicación de Health Connect para ver si lee y envía los datos
         correctamente.
      8. Crear una manera de asignar un nº de tablet a un paciente en la aplicación web.
  */

  // // Función para obtener y mostrar todos los datos almacenados en AsyncStorage
  // const viewAsyncStorageContent = async () => {
  //   try {
  //     const keys = await AsyncStorage.getAllKeys();
  //     const result = await AsyncStorage.multiGet(keys);
  //     console.log("Async Storage: ", result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // // Llama a esta función en algún lugar de tu código para ver los datos
  // viewAsyncStorageContent();


  const restartCadence = () => {
    setExercisesThisWeek(0);
  }

  // Hook para comprobar si el paciente puede realizar la rutina
  const { canStartRoutine, completeRoutine } = useCheckDate(restartCadence, patientData.treatment_cadence, clearPersistentData);


  // Función para enviar los landmarks a la API
  const sendLandmarks = async () => {
    const response = await sendPatientData.sendLandmarks(landmarks, date);
    console.log("Landmarks Response: ", response);
  }

  // Función para enviar los datos de Health Connect a la API
  const sendHealthData = async () => {
    const response = await sendPatientData.sendHealthConnectData(steps, flights, distance, date);
    console.log("HealthConnect Response: ", response);
  }

  const handleStartRoutine = () => {
    if (canStartRoutine) {
      setRoutineStarted(true);
    } else {
      alert('Ya has realizado la rutina hoy. Vuelve mañana para más ejercicio.');
    }
  }

  const handleRetrieveRoutine = async (routine_id: number) => {
    // Aquí se debería hacer una llamada a la API para obtener la rutina del paciente
    const response = await getPatientData.getRoutine(routine_id);
    setRoutine({
      name: response.name,
      description: response.description,
      estimatedTime: response.estimatedTime,
      exercises: response.exercises,
    });
  }

  const handleLogin = async (data: CheckTabletTypes) => {
    await setPatientData({
      routine_id: data.routine_id,
      patient_id: data.patient_id,
      treatment_time: data.treatment_time,
      treatment_cadence: data.treatment_cadence
    });
    handleRetrieveRoutine(data.routine_id);
    setIsAuthenticated(true)
  }


  const handleGoBack = () => {
    if (showMediapipe) {
      setShowMediapipe(false);
    } else if (routineStarted) {
      setRoutineStarted(false);
    } else if (isAuthenticated) {
      setIsAuthenticated(false);
    }
  };

  // Función para cerrar la cámara y preparar los landmarks a enviar
  const handleCloseMediapipe = async () => {

    // Cierra la vista de Google Mediapipe
    setShowMediapipe(false);

    completeRoutine();

    // Gestión del índice de ejercicio para mostrar el siguiente    
    if (currentExerciseIndex < (routine.exercises?.length ?? 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      await setExercisesThisWeek(exercisesThisWeek + 1);
      await setRoutineStarted(false); // Me lleva a la pantalla de empezar rutina
      await setRoutine({ name: '¡Rutina Diaria Completada!' }) // Cambia la descripción de la rutina por un mensaje de éxito
      await setIsRoutineButtonEnabled(false); // Desactiva el botón de empezar rutina
    }

    // Llama a la función que devuelve los landmarks
    const results = startPoseLandmarker();

    // Genera el Array de landmarks
    const { landmarksArray } = await useGenerateLandmarksToSend(results);
    +
      // Actualiza el estado de landmarks con el Array de landmarks
      await setLandmarks(landmarksArray);

    // Actualiza la fecha y envía los landmarks a la API
    const currentDate: Date = new Date();
    await setDate(currentDate);
    await setFlagHC(true);
    sendLandmarks();
  }

  // Hook para enviar los datos de Health Connect a la API
  useEffect(() => {
    // Si no es la primera vez que se ejecuta, llama a la función de lectura de datos de Health Connect
    if (flagHC) {
      readData().then(() => {
        sendHealthData();
      });
    }
  }, [date]);

  const toggleSection = (section: string) => {
    setActiveSections((prevSections) =>
      prevSections.includes(section)
        ? prevSections.filter((sec) => sec !== section)
        : [...prevSections, section]
    );
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} tabletNumber={tabletNumber} setTabletNumber={setTabletNumber} />;
  }

  if (!routineStarted && isAuthenticated) {
    return (
      <RoutineScreen
        routine={routine}
        activeSections={activeSections}
        toggleSection={toggleSection}
        handleGoBack={handleGoBack}
        handleStartRoutine={handleStartRoutine}
        isRoutineButtonEnabled={isRoutineButtonEnabled}
      />
    );
  }

  return (
    <>
      {!showMediapipe ? (
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.exerciseContent}>
            <Text style={styles.exerciseTitle}>{routine.exercises?.[currentExerciseIndex].name}</Text>
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseDetailsText}>{routine.exercises?.[currentExerciseIndex].description}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.startRoutineButton} onPress={() => setShowMediapipe(true)}>
            <Text style={styles.startRoutineButtonText}>Empezar Ejercicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <Tablet_mediapipeView style={{ flex: 1, width: '100%', height: '80%' }} />
          </View>
          <View style={styles.react}>
            <TouchableOpacity style={styles.startRoutineButton} onPress={handleCloseMediapipe}>
              <Text style={styles.startRoutineButtonText}>Siguiente</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
          </View>
        </>
      )}
    </>
  );
}