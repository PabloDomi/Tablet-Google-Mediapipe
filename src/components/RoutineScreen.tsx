import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../css/styles';
import { RoutineType } from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RoutineScreenProps {
    routine: RoutineType;
    activeSections: number[];
    toggleSection: (section: number) => void;
    handleGoBack: () => void;
    handleStartRoutine: () => void;
    canStartRoutine: boolean;
    VentanaModal: () => JSX.Element;
    cadence: number;
    treatmentTime: number;
    exercisesThisWeek: number;
    getCurrentDate: () => string;
    getDaysBetweenDates: (firstDate: string, secondDate: string) => number;
}

const RoutineScreen: React.FC<RoutineScreenProps> = ({
    routine,
    activeSections,
    toggleSection,
    handleGoBack,
    handleStartRoutine,
    canStartRoutine,
    VentanaModal,
    cadence,
    treatmentTime,
    exercisesThisWeek,
    getCurrentDate,
    getDaysBetweenDates
}) => {

    const [daysBetweenDates, setDaysBetweenDates] = useState<number>(treatmentTime);
    const exercisesLeftThisWeek = cadence - exercisesThisWeek;
    const getFirstExerciseDate = async () => {
        const date = await AsyncStorage.getItem('firstExerciseDate');
        return date;
    };

    const currentDate = getCurrentDate();

    getFirstExerciseDate().then((firstExerciseDate) => {
        if (firstExerciseDate) {
            setDaysBetweenDates(getDaysBetweenDates(firstExerciseDate, currentDate));
        }
    });

    return (
        <View style={styles.container}>
            <VentanaModal />
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
