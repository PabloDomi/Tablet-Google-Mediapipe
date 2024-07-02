import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { startPoseLandmarker } from './modules/tabletMediapipe'
import React, { useEffect, useState } from 'react';
import Tablet_mediapipeView from './modules/tabletMediapipe/src/tablet_mediapipeView';
import useHealthData from './src/hooks/useHealthData';
import useGenerateLandmarksToSend from './src/hooks/useGenerateLandmarksToSend';
import sendPatientData from './src/services/sendPatientData';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface RoutineType {
  title?: string;
  description?: string;
  exercises?: ExerciseType[];
}

interface ExerciseType {
  id?: string;
  name?: string;
  details?: string;
  estimatedTime?: string;
}

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

  const handleLogin = () => {
    if (tabletNumber > 0) {
      setIsAuthenticated(true)
    } else {
      alert('Introduce un número de tablet válido')
    }
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

  const handleStartRoutine = () => {
    setRoutineStarted(true);
  }

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
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Ingrese el número de la tablet</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de tablet"
          value={tabletNumber.toString()}
          onChangeText={(text) => setTabletNumber(parseInt(text))}
          keyboardType="numeric"
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  if (!routineStarted) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.routineContent}>
          <View style={styles.routineHeader}>
            <Text style={styles.routineTitle}>{routine.title ?? 'Error cargando la rutina...'}</Text>
            <Text style={styles.routineDescription}>{routine.description ?? ''}</Text>
          </View>
        </ScrollView>
        <FlatList
          data={routine.exercises}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.exerciseItem}
                onPress={() => toggleSection(item.id ?? '')}
              >
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Icon
                  name={activeSections.includes(item.id ?? '') ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <Collapsible collapsed={!activeSections.includes(item.id ?? '')}>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetailsText}>{item.details}</Text>
                </View>
              </Collapsible>
            </View>
          )}
          keyExtractor={(item) => item.id ?? ''}
          contentContainerStyle={styles.exerciseList}
        />
        <TouchableOpacity
          style={[styles.startRoutineButton, !isRoutineButtonEnabled && styles.disabledButton]}
          onPress={handleStartRoutine}
          disabled={!isRoutineButtonEnabled} // Aquí se desactiva el botón
        >
          <Text style={styles.startRoutineButtonText}>Empezar rutina</Text>
        </TouchableOpacity>
      </View>
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

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2D34',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#2A2D34',
    padding: 20,
  },
  routineHeader: {
    alignItems: 'center',
  },
  routineTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7e94c5',
    fontFamily: 'system-ui',
    marginBottom: 10,
    paddingTop: 50,
  },
  routineDescription: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
    textAlign: 'center',
  },
  exerciseList: {
    flexGrow: 1,
  },
  exerciseItem: {
    backgroundColor: '#3C4047',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
  },
  exerciseDetails: {
    backgroundColor: '#8f99b3',
    padding: 30,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  exerciseDetailsText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
    fontSize: 18,
    color: '#FFFFFF',
    backgroundColor: '#3C4047',
    fontFamily: 'system-ui',
    borderRadius: 8,
  },
  react: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2D34',
    padding: 20,
  },
  startRoutineButton: {
    backgroundColor: '#7e94c5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  startRoutineButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
    fontWeight: 'bold',
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7e94c5',
    textAlign: 'center',
    fontFamily: 'system-ui',
  },
  estimatedTime: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'system-ui',
  },
  exerciseContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#7e94c5',
    borderRadius: 30,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomButtonContainer: {
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#b0b0b0', // Cambia el color para indicar que está deshabilitado
  },
});
