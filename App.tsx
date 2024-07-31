import { StatusBar } from 'expo-status-bar';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { startPoseLandmarker, getFramesPerSecond } from './modules/tabletMediapipe'
import React, { useState } from 'react';
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
import LogoutScreen from './src/components/LogoutScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import CountdownCamera from './src/components/CountdownCamera';


export default function App() {

  // Controla la visibilidad de la cámara
  const [showMediapipe, setShowMediapipe] = useState<boolean>(false);

  // Fecha actual para enviar a la API
  const [dateExerciseStarted, setDateExerciseStarted] = useState<Date>(new Date());

  // Health Connect data
  const { steps, flights, distance, readData } = useHealthData()

  // Estado de comienzo de rutina
  const [routineStarted, setRoutineStarted] = useState<boolean>(false);

  // Estado para los desplegables de los ejercicios
  const [activeSections, setActiveSections] = useState<number[]>([]);

  // Estado para mostrar el Modal de Logout
  const [showLogout, setShowLogout] = useState<boolean>(false);

  // Estado para mostrar el contador de tiempo
  const [showCountdown, setShowCountdown] = useState(false);

  /*
    TODO:           
      6. (Calentada) mostrar una barra de progreso según se van realizando los ejercicios? (opcional)
      7. Intentar de alguna manera añadir datos a la aplicación de Health Connect para ver si lee y envía los datos
         correctamente.
  */


  // Hook para obtener y almacenar los datos persistentes
  const {
    isAuthenticated,
    setIsAuthenticated,
    tabletNumber,
    setTabletNumber,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    patientData,
    setPatientData,
    exercisesThisWeek,
    setExercisesThisWeek,
    routine,
    setRoutine,
    clearPersistentData,
    setCanStartRoutine,
    canStartRoutine
  } = usePersistentState();


  // Función para reiniciar la cadencia de ejercicios
  const restartCadence = () => {
    setExercisesThisWeek(0);
  }


  // Hook para comprobar si el paciente puede realizar la rutina
  const { completeRoutine, getCurrentDate, getDaysBetweenDates } = useCheckDate(restartCadence, patientData.treatment_cadence, clearPersistentData, setCanStartRoutine);


  // Función para obtener y mostrar todos los datos almacenados en AsyncStorage
  // const viewAsyncStorageContent = async () => {
  //   try {
  //     const keys = await AsyncStorage.getAllKeys();
  //     const result = await AsyncStorage.multiGet(keys);
  //     console.log("Async Storage: ", result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  // Llama a esta función en algún lugar de tu código para ver los datos
  // useEffect(() => {
  //   viewAsyncStorageContent();
  // }, [isAuthenticated]);


  // Función para enviar los landmarks a la API
  const sendLandmarks = async (results: string[], fps: number) => {

    // Genera el Array de landmarks
    const { landmarksArray } = await useGenerateLandmarksToSend(results);

    // Actualiza la fecha y envía los landmarks a la API
    const currentDate: Date = new Date();
    await sendPatientData.sendLandmarks(patientData.patient_id, (routine.exercises?.[currentExerciseIndex].name ?? ''), landmarksArray, currentDate, fps);

    readData(dateExerciseStarted.toISOString(), currentDate.toISOString()).then(() => {
      sendHealthData();
    });

  }

  // Función para enviar los datos de Health Connect a la API
  const sendHealthData = async () => {
    const currentDate: Date = new Date();

    await sendPatientData.sendHealthConnectData(steps, flights, distance, currentDate);

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
    if (routine.name === '¡Rutina Diaria Completada!') {
      setRoutine(routine);
      return
    }
    const response = await getPatientData.getRoutine(routine_id);
    console.log("Rutina recuperada: ", response.exercises);
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
    if (showMediapipe && routineStarted && isAuthenticated) {
      setShowMediapipe(false);
    } else if (routineStarted && isAuthenticated) {
      setRoutineStarted(false);
    } else if (isAuthenticated) {
      setShowLogout(true);
    }
  };

  const closeModal = () => {
    setShowLogout(false);
  }

  // Función para cerrar la cámara y preparar los landmarks a enviar
  const handleCloseMediapipe = async () => {

    // Cierra la vista de Google Mediapipe
    setShowMediapipe(false);


    // Gestión del índice de ejercicio para mostrar el siguiente    
    if (currentExerciseIndex < (routine.exercises?.length ?? 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      completeRoutine();
      await setExercisesThisWeek(exercisesThisWeek + 1);
      await setRoutineStarted(false); // Me lleva a la pantalla de empezar rutina
      await setRoutine({ name: '¡Rutina Diaria Completada!' }) // Cambia la descripción de la rutina por un mensaje de éxito
    }

    // Llama a la función que devuelve los landmarks
    const results = await startPoseLandmarker();
    const fps = await getFramesPerSecond();
    sendLandmarks(results, fps);
  }

  const handleOpenMediapipe = () => {
    setShowCountdown(true);
  };

  const handleCountdownFinish = () => {
    setShowCountdown(false);
    setDateExerciseStarted(new Date());
    setShowMediapipe(true);
  };

  const toggleSection = (section: number) => {
    setActiveSections((prevSections) =>
      prevSections.includes(section)
        ? prevSections.filter((sec) => sec !== section)
        : [...prevSections, section]
    );
  };

  if (!isAuthenticated) {

    return <LoginScreen
      onLogin={handleLogin}
      tabletNumber={tabletNumber}
      setTabletNumber={setTabletNumber}
    />;
  }

  const VentanaModal = () => {
    return (
      <Modal
        visible={showLogout}
        animationType='slide'
        transparent={true}
        onRequestClose={closeModal}
      >
        <LogoutScreen
          setIsAuthenticated={setIsAuthenticated}
          closeModal={closeModal}
          clearPersistentData={clearPersistentData}
        />
      </Modal>
    )
  }

  if (!routineStarted && isAuthenticated) {
    return (
      <RoutineScreen
        routine={routine}
        activeSections={activeSections}
        toggleSection={toggleSection}
        handleGoBack={handleGoBack}
        handleStartRoutine={handleStartRoutine}
        canStartRoutine={canStartRoutine}
        VentanaModal={VentanaModal}
        cadence={patientData.treatment_cadence}
        treatmentTime={patientData.treatment_time}
        exercisesThisWeek={exercisesThisWeek}
        getCurrentDate={getCurrentDate}
        getDaysBetweenDates={getDaysBetweenDates}
      />
    );
  }

  return (
    <>
      {showCountdown ? (
        <CountdownCamera onCountdownFinish={handleCountdownFinish} />
      ) : (
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
              <TouchableOpacity style={styles.startRoutineButton} onPress={handleOpenMediapipe}>
                <Text style={styles.startRoutineButtonText}>Empezar Ejercicio</Text>
              </TouchableOpacity>
            </View >
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
          )
          }
        </>
      )}
    </>
  );
}