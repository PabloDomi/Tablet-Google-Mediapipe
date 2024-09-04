import { TouchableOpacity } from "react-native";
import { ScrollView, View, Text } from "react-native";
import { startPoseLandmarker, getFramesPerSecond } from '../../modules/tabletMediapipe'
import { useState } from "react";
import useSendPatientData from "../hooks/useSendPatientData";
import { CheckTabletTypes, RoutineType } from "../utils/types";
import CountdownCamera from "./CountdownCamera";
import styles from "../css/styles";
import Icon from "react-native-vector-icons/MaterialIcons"
import { StatusBar } from "expo-status-bar";
import Tablet_mediapipeView from "../../modules/tabletMediapipe/src/tablet_mediapipeView";


interface StartExerciseProps {
    completeRoutine: () => Promise<void>;
    currentExerciseIndex: number;
    setCurrentExerciseIndex: (index: number) => void;
    patientData: CheckTabletTypes;
    routine: RoutineType;
    setRoutine: (routine: RoutineType) => void;
    setRoutineStarted: (started: boolean) => void;
    exercisesThisWeek: number;
    setExercisesThisWeek: (exercises: number) => void;
}

export default function StartExercise({ completeRoutine, currentExerciseIndex, setCurrentExerciseIndex, patientData, routine, setRoutine, setRoutineStarted, exercisesThisWeek, setExercisesThisWeek }: StartExerciseProps) {

    // Estado para mostrar el contador de tiempo
    const [showCountdown, setShowCountdown] = useState(false);

    // Controla la visibilidad de la cámara
    const [showMediapipe, setShowMediapipe] = useState<boolean>(false);

    // Fecha actual para enviar a la API
    const [dateExerciseStarted, setDateExerciseStarted] = useState<Date>(new Date());

    // Hook para enviar los landmarks a la API
    const { sendLandmarks } = useSendPatientData(patientData, routine, currentExerciseIndex, dateExerciseStarted);

    const handleOpenMediapipe = () => {
        setShowCountdown(true);
    };

    const handleCountdownFinish = () => {
        setShowCountdown(false);
        setDateExerciseStarted(new Date());
        setShowMediapipe(true);
    };

    const handleGoBack = () => {
        setRoutineStarted(false);
    }

    // Función para cerrar la cámara y preparar los landmarks a enviarS
    const handleCloseMediapipe = async () => {

        let results = []

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
        results = await startPoseLandmarker();
        const fps = await getFramesPerSecond();
        sendLandmarks(results, fps);
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
                                <Text style={styles.exerciseDetailsText}>{routine.exercises?.[currentExerciseIndex].description}</Text>
                                {currentExerciseIndex === 0 &&
                                    <View style={styles.infoContainer}>
                                        <View style={styles.iconContainer}>
                                            <Icon name="info" size={30} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.infoText}>
                                            Al pulsar el botón "Empezar ejercicio" va a tener 20 segundos para preparar la colocación del dispositivo.
                                            Debe asegurarse de que haya suficiente luz y se muestre su cuerpo completo y centrado.
                                        </Text>
                                    </View>
                                }
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
    )
}
