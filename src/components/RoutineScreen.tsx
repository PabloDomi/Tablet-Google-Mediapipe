import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../css/styles';
import { RoutineType } from '../utils/types';

interface RoutineScreenProps {
    routine: RoutineType;
    activeSections: string[];
    toggleSection: (section: string) => void;
    handleGoBack: () => void;
    handleStartRoutine: () => void;
    isRoutineButtonEnabled: boolean;
}

const RoutineScreen: React.FC<RoutineScreenProps> = ({
    routine,
    activeSections,
    toggleSection,
    handleGoBack,
    handleStartRoutine,
    isRoutineButtonEnabled,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.routineContent}>
                <View style={styles.routineHeader}>
                    <Text style={styles.routineTitle}>{routine.name ?? 'Error cargando la rutina...'}</Text>
                    <Text style={styles.estimatedTime}>{routine.estimatedTime ?? 0} minutos</Text>
                    <Text style={styles.routineDescription}>{routine.description ?? ''}</Text>
                </View>
            </ScrollView>
            <FlatList
                data={routine.exercises}
                renderItem={({ item, index }) => (
                    <View key={index}>
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
                                <Text style={styles.exerciseDetailsText}>{item.description}</Text>
                            </View>
                        </Collapsible>
                    </View>
                )}
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
};

export default RoutineScreen;
