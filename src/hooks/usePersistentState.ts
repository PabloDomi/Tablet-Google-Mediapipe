import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import getPatientData from '../services/getPatientData';
import { CheckTabletTypes, RoutineType } from '../utils/types';

function usePersistentState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tabletNumber, setTabletNumber] = useState<number>(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [isRoutineButtonEnabled, setIsRoutineButtonEnabled] = useState<boolean>(true);
  const [patientData, setPatientData] = useState<CheckTabletTypes>({
    routine_id: 0,
    patient_id: 0,
    treatment_time: 0,
    treatment_cadence: 0
  });
  const [exercisesThisWeek, setExercisesThisWeek] = useState<number>(0);
  const [routine, setRoutine] = useState<RoutineType>({
    name: 'Rutina de Ejemplo',
    description: 'Esta es una rutina de ejemplo para demostración.',
    estimatedTime: 30,
    exercises: [
      { id: '1', name: 'Ejercicio 1: Flexiones', description: 'Haz 3 series de 15 repeticiones.' },
      { id: '2', name: 'Ejercicio 2: Sentadillas', description: 'Haz 4 series de 20 repeticiones.' },
      { id: '3', name: 'Ejercicio 3: Abdominales', description: 'Haz 3 series de 30 repeticiones.' },
    ],
  });
  const isFirstRender = useRef(true);
  const isSecondRender = useRef(true);

  useEffect(() => {
    const initializeState = async () => {
      try {
        const storedTabletNumber = await AsyncStorage.getItem('tabletNumber');

        if (storedTabletNumber !== null) {
          const tabletNumber = parseInt(storedTabletNumber);
          await getPatientData.checkLogin(tabletNumber);
          setTabletNumber(tabletNumber);

          const storedIsAuthenticated = await AsyncStorage.getItem('isAuthenticated');
          if (storedIsAuthenticated !== "false" && storedIsAuthenticated !== null ) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }

          const storedCurrentExerciseIndex = await AsyncStorage.getItem('currentExerciseIndex');
          if (storedCurrentExerciseIndex !== null) {
            setCurrentExerciseIndex(parseInt(storedCurrentExerciseIndex));
          }

          const storedIsRoutineButtonEnabled = await AsyncStorage.getItem('isRoutineButtonEnabled');
          if (storedIsRoutineButtonEnabled !== null) {
            setIsRoutineButtonEnabled(JSON.parse(storedIsRoutineButtonEnabled));
          }

          const storedPatientData = await AsyncStorage.getItem('patientData');
          if (storedPatientData !== null) {
            setPatientData(JSON.parse(storedPatientData));
          }

          const storedExercisesThisWeek = await AsyncStorage.getItem('exercisesThisWeek');
          if (storedExercisesThisWeek !== null) {
            setExercisesThisWeek(parseInt(storedExercisesThisWeek));
          }

          const storedRoutine = await AsyncStorage.getItem('routine');
          if (storedRoutine !== null) {
            setRoutine(JSON.parse(storedRoutine));
          }
        }
      } catch (error) {
        await clearPersistentData();
        alert('No hay un paciente asociado a este número de tablet.');
        console.error('Error initializing state:', error);
      }
    };

    initializeState();
  }, []);

  const clearPersistentData = async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    await AsyncStorage.removeItem('tabletNumber');
    await AsyncStorage.removeItem('currentExerciseIndex');
    await AsyncStorage.removeItem('isRoutineButtonEnabled');
    await AsyncStorage.removeItem('patientData');
    await AsyncStorage.removeItem('exercisesThisWeek');
    await AsyncStorage.removeItem('routine');
  };

  const saveStateToStorage = async () => {
    await AsyncStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    await AsyncStorage.setItem('tabletNumber', tabletNumber?.toString() ?? '');
    await AsyncStorage.setItem('currentExerciseIndex', currentExerciseIndex.toString());
    await AsyncStorage.setItem('isRoutineButtonEnabled', JSON.stringify(isRoutineButtonEnabled));
    await AsyncStorage.setItem('patientData', JSON.stringify(patientData));
    await AsyncStorage.setItem('exercisesThisWeek', exercisesThisWeek.toString());
    await AsyncStorage.setItem('routine', JSON.stringify(routine));
  };

  useEffect(() => {
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if(isSecondRender.current && !isFirstRender.current) {
      isSecondRender.current = false;
      return;
    }
      saveStateToStorage();
  }, [isAuthenticated, tabletNumber, currentExerciseIndex, isRoutineButtonEnabled, patientData, exercisesThisWeek, routine]);

  return {
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
  };
}

export default usePersistentState;
