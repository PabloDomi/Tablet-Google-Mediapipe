import React, { useState } from 'react';
import LoginScreen from './src/components/LoginScreen';
import RoutineScreen from './src/components/RoutineScreen';
import useCheckDate from './src/hooks/useCheckDate';
import usePersistentState from './src/hooks/usePersistentState';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import StartExercise from './src/components/StartExercise';


export default function App() {

  /*
    TODO:           
      6. (Calentada) mostrar una barra de progreso según se van realizando los ejercicios? (opcional)
      7. Intentar de alguna manera añadir datos a la aplicación de Health Connect para ver si lee y envía los datos
         correctamente.
  */


  // Estado de comienzo de rutina
  const [routineStarted, setRoutineStarted] = useState<boolean>(false);


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


  // Hook para comprobar si el paciente puede realizar la rutina
  const { completeRoutine, getCurrentDate, getDaysBetweenDates } = useCheckDate(patientData.treatment_cadence, clearPersistentData, setCanStartRoutine, setExercisesThisWeek);


  /* ======================= PARA DEPURACIÓN ======================= */

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

  /* ======================= PARA DEPURACIÓN ======================= */


  if (!isAuthenticated) {
    return (
      <LoginScreen
        setPatientData={setPatientData}
        routine={routine}
        setRoutine={setRoutine}
        tabletNumber={tabletNumber}
        setTabletNumber={setTabletNumber}
        setIsAuthenticated={setIsAuthenticated}
      />
    )
  }

  if (!routineStarted && isAuthenticated) {
    return (
      <RoutineScreen
        routine={routine}
        canStartRoutine={canStartRoutine}
        cadence={patientData.treatment_cadence}
        treatmentTime={patientData.treatment_time}
        exercisesThisWeek={exercisesThisWeek}
        getCurrentDate={getCurrentDate}
        getDaysBetweenDates={getDaysBetweenDates}
        setIsAuthenticated={setIsAuthenticated}
        clearPersistentData={clearPersistentData}
        setRoutineStarted={setRoutineStarted}
      />
    );
  }

  return (
    <StartExercise
      completeRoutine={completeRoutine}
      currentExerciseIndex={currentExerciseIndex}
      setCurrentExerciseIndex={setCurrentExerciseIndex}
      patientData={patientData}
      routine={routine}
      setRoutine={setRoutine}
      setRoutineStarted={setRoutineStarted}
      exercisesThisWeek={exercisesThisWeek}
      setExercisesThisWeek={setExercisesThisWeek}
    />
  );
}