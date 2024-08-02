import sendPatientData from "../services/sendPatientData";
import { CheckTabletTypes, RoutineType } from "../utils/types";
import useGenerateLandmarksToSend from "./useGenerateLandmarksToSend";
import useHealthData from "./useHealthData";


function useSendPatientData(patientData: CheckTabletTypes, routine: RoutineType, currentExerciseIndex: number, dateExerciseStarted: Date) {


    // Health Connect data
    const { steps, flights, distance, readData } = useHealthData()

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


    return { sendLandmarks }
}

export default useSendPatientData
