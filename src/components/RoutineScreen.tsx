import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../css/styles';
import { RoutineType } from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VentanaModal from './VentanaModal';

interface RoutineScreenProps {
    routine: RoutineType;
    canStartRoutine: boolean;
    cadence: number;
    treatmentTime: number;
    exercisesThisWeek: number;
    getCurrentDate: () => string;
    getDaysBetweenDates: (firstDate: string, secondDate: string) => number;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    clearPersistentData: () => void;
    setRoutineStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoutineScreen: React.FC<RoutineScreenProps> = ({
    routine,
    canStartRoutine,
    cadence,
    treatmentTime,
    exercisesThisWeek,
    getCurrentDate,
    getDaysBetweenDates,
    setIsAuthenticated,
    clearPersistentData,
    setRoutineStarted
}) => {

    // Estado para los días restantes de rehabilitación
    const [daysBetweenDates, setDaysBetweenDates] = useState<number>(treatmentTime);

    // Estado para los desplegables de los ejercicios
    const [activeSections, setActiveSections] = useState<number[]>([]);

    // Estado para mostrar el Modal de Logout
    const [showLogout, setShowLogout] = useState<boolean>(false);

    const exercisesLeftThisWeek = cadence - exercisesThisWeek;

    const getFirstExerciseDate = async () => {
        const date = await AsyncStorage.getItem('firstExerciseDate');
        return date;
    };

    const handleStartRoutine = () => {
        if (canStartRoutine) {
            setRoutineStarted(true);
        } else {
            alert('Ya has realizado la rutina hoy. Vuelve mañana para más ejercicio.');
        }
    }

    const toggleSection = (section: number) => {
        setActiveSections((prevSections) =>
            prevSections.includes(section)
                ? prevSections.filter((sec) => sec !== section)
                : [...prevSections, section]
        );
    };

    const handleGoBack = () => {
        setShowLogout(true);
    }

    const currentDate = getCurrentDate();

    getFirstExerciseDate().then((firstExerciseDate) => {
        if (firstExerciseDate) {
            setDaysBetweenDates(getDaysBetweenDates(firstExerciseDate, currentDate));
        }
    });

    return (
        <View style={styles.container}>
            <VentanaModal
                showLogout={showLogout}
                setShowLogout={setShowLogout}
                setIsAuthenticated={setIsAuthenticated}
                clearPersistentData={clearPersistentData}
            />
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.routineContent}>
                <View style={styles.routineHeader}>
                    <Text style={styles.routineTitle}>{routine.name ?? 'Error cargando la rutina...'}</Text>
                    {canStartRoutine &&
                        <>
                            <Text style={styles.estimatedTime}>{routine.estimatedTime ?? 0} minutos</Text>
                            <Text style={styles.routineDescription}>{routine.description ?? ''}</Text>
                        </>
                    }
                    {!canStartRoutine &&
                        <>
                            <Text style={styles.estimatedTime}>Quedan {treatmentTime - daysBetweenDates} días de rehabilitación</Text>
                            <Text style={styles.routineDescription}>Tiene {exercisesLeftThisWeek} entrenamientos restantes esta semana.</Text>
                        </>
                    }
                </View>
            </ScrollView>
            <FlatList
                data={routine.exercises}
                renderItem={({ item, index }) => (
                    <View key={index}>
                        <TouchableOpacity
                            style={styles.exerciseItem}
                            onPress={() => toggleSection(index)}
                        >
                            <Text style={styles.exerciseName}>{item.name}</Text>
                            <Icon
                                name={activeSections.includes(index) ? 'expand-less' : 'expand-more'}
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                        <Collapsible collapsed={!activeSections.includes(index)}>
                            <View style={styles.exerciseDetails}>
                                <Text style={styles.exerciseDetailsText}>{item.description}</Text>
                            </View>
                        </Collapsible>
                    </View>
                )}
                contentContainerStyle={styles.exerciseList}
            />
            {canStartRoutine &&
                <TouchableOpacity
                    style={styles.startRoutineButton}
                    onPress={handleStartRoutine}
                >
                    <Text style={styles.startRoutineButtonText}>Empezar rutina</Text>
                </TouchableOpacity>
            }
        </View>
    );
};

export default RoutineScreen;
