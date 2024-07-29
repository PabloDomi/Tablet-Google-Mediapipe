import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

// Obtiene la fecha actual en formato 'YYYY-MM-DD'
const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const getDaysBetweenDates = (date1: string, date2: string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Obtiene si el día actual es lunes
const isMonday = () => {
  const today = new Date();
  return today.getDay() === 1; // 1 representa el lunes en JavaScript
};

function useCheckDate(restartCadence: () => void, treatmentTime: number, clearPersistentData: () => void, setCanStartRoutine: (value: boolean) => void) {
    const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
    const [todayIsMonday, setTodayIsMonday] = useState<boolean>(false);
    const firstRefresh = useRef(true);
  
    useEffect(() => {
      if(firstRefresh.current){
        firstRefresh.current = false;
        return;
      }
      
      const fetchLastCompletedDate = async () => {
        const storedDate = await AsyncStorage.getItem('lastCompletedDate');
        const currentDate = getCurrentDate();
        const firstExerciseDate = await AsyncStorage.getItem('firstExerciseDate');

        if (firstExerciseDate && getDaysBetweenDates(firstExerciseDate, currentDate) >= treatmentTime) {
          await clearPersistentData();
          setCanStartRoutine(true); // Restablecer canStartRoutine después de limpiar los datos
      }
  
        if (storedDate) {
            setLastCompletedDate(storedDate);
          
            // Compara la fecha almacenada con la actual
            setCanStartRoutine(storedDate !== currentDate);
        } else {
            setCanStartRoutine(true);
        }

        // Verifica si hoy es lunes
        setTodayIsMonday(isMonday());

        if (todayIsMonday) {
          restartCadence();
        }
      };
  
      fetchLastCompletedDate();
    }, []);
  
    const completeRoutine = async () => {
      const currentDate = getCurrentDate();
      await AsyncStorage.setItem('lastCompletedDate', currentDate);
      setLastCompletedDate(currentDate);
      setCanStartRoutine(false);

      const firstExerciseDate = await AsyncStorage.getItem('firstExerciseDate');
      if (!firstExerciseDate) {
        await AsyncStorage.setItem('firstExerciseDate', currentDate);
      }
    };
  
    return { lastCompletedDate, completeRoutine, todayIsMonday, getCurrentDate, getDaysBetweenDates };
}

export default useCheckDate;
