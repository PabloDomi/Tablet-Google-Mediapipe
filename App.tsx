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
import { RoutineType } from './src/utils/types';
import LoginScreen from './src/components/LoginScreen';
import RoutineScreen from './src/components/RoutineScreen';


export default function App() {

  // Controla la visibilidad de la cámara
  const [showMediapipe, setShowMediapipe] = useState<boolean>(false);

  // Landmarks para enviar a la API
  const [landmarks, setLandmarks] = useState<string[]>([]);

  // Fecha actual para enviar a la API
  const [date, setDate] = useState<Date>(new Date());

  // Health Connect data
  const { steps, flights, distance, readData } = useHealthData(date)

  // Controla que la lectura de Health Connect se haga después de la primera lectura de landmarks
  const [flag, setFlag] = useState<boolean>(false)

  // Estado para el nº de tablet
  const [tabletNumber, setTabletNumber] = useState<number>(0);

  // Estado que renderiza el login si no está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Estado de comienzo de rutina
  const [routineStarted, setRoutineStarted] = useState<boolean>(false);

  // Estado para los desplegables de los ejercicios
  const [activeSections, setActiveSections] = useState<string[]>([]);

  // Estado para el índice del ejercicio por el que se va.
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  // Estado para desactivar el botón de realizar rutina cuando ya se ha acabado
  const [isRoutineButtonEnabled, setIsRoutineButtonEnabled] = useState<boolean>(true);


  // Estado para la rutina del paciente
  const [routine, setRoutine] = useState<RoutineType>({
    title: 'Rutina de Ejemplo',
    description: 'Esta es una rutina de ejemplo para demostración.',
    exercises: [
      { id: '1', name: 'Ejercicio 1: Flexiones', details: 'Haz 3 series de 15 repeticiones.', estimatedTime: '10 minutos' },
      { id: '2', name: 'Ejercicio 2: Sentadillas', details: 'Haz 4 series de 20 repeticiones.', estimatedTime: '15 minutos' },
      { id: '3', name: 'Ejercicio 3: Abdominales', details: 'Haz 3 series de 30 repeticiones.', estimatedTime: '12 minutos' },
    ],
  });


  /*
    TODO: 
      1. Añadir a la base de datos el nº de tablet a una nueva tabla que relacione el id de tablet con el id de paciente.
      2. Coger el nº de tablet introducido aqui y buscarlo en la base de datos, con eso, 
         recuperar la rutina del paciente en la base de datos.
      3. Actualizar el estado de "routine", con la rutina del paciente recuperada (tener en cuenta que los tipos pueden
         diferir de los del ejemplo).
      4. De alguna manera, contar 24 horas desde que se termina la rutina, y volver a mostrar la rutina del paciente,
         para que la realice otra vez. Para probar, coge menos tiempo, tipo 30 segundos. Se podrá tener un tiempo
         establecido de cada cuanto se debe realizar la rutina, asi que añadirlo a la base de datos? (a lo mejor).
      5. Crear persistencia de sesión y token jwt para el paciente, para que no tenga que introducir el nº de tablet
         cada vez que entre. El sistema comprobará automaticamente si el número de tablet es válido en BBDD.
      6. (Calentada) mostrar una barra de progreso según se van realizando los ejercicios? (opcional)
      7. Intentar de alguna manera añadir datos a la aplicación de Health Connect para ver si lee y envía los datos
         correctamente.
  */


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
    setRoutineStarted(true);
  }

  const handleLogin = (tabletNumber: number) => {
    setIsAuthenticated(true)
    setTabletNumber(tabletNumber)
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

    // Gestión del índice de ejercicio para mostrar el siguiente    
    if (currentExerciseIndex < (routine.exercises?.length ?? 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      await setRoutineStarted(false); // Me lleva a la pantalla de empezar rutina
      await setRoutine({ title: '¡Rutina Diaria Completada!' }) // Cambia la descripción de la rutina por un mensaje de éxito
      await setIsRoutineButtonEnabled(false); // Desactiva el botón de empezar rutina
    }

    // Llama a la función que devuelve los landmarks
    const results = startPoseLandmarker();

    // Genera el Array de landmarks
    const { landmarksArray } = await useGenerateLandmarksToSend(results);

    // Actualiza el estado de landmarks con el Array de landmarks
    await setLandmarks(landmarksArray);

    // Actualiza la fecha y envía los landmarks a la API
    const currentDate: Date = new Date();
    await setDate(currentDate);
    await setFlag(true);
    sendLandmarks();
  }

  // Hook para enviar los datos de Health Connect a la API
  useEffect(() => {
    // Si no es la primera vez que se ejecuta, llama a la función de lectura de datos de Health Connect
    if (flag) {
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
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!routineStarted) {
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
            <Text style={styles.estimatedTime}>Tiempo estimado: {routine.exercises?.[currentExerciseIndex].estimatedTime}</Text>
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseDetailsText}>{routine.exercises?.[currentExerciseIndex].details}</Text>
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