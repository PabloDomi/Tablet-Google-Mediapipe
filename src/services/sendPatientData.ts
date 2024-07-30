import axios from "axios";

async function sendLandmarks(patient_id: number, exercise_name: string, landmarks: string[], date: Date, fps: number) {
  // Con axios
  try {
    const response = await axios.post('https://physiotherapist-api.onrender.com/api/patient_management/patientLandmarks', {
      patient_id: patient_id,
      exercise_name: exercise_name,
      landmarks: landmarks,
      date: date,
      fps: fps
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function sendHealthConnectData (steps: number, flights: number, distance: number, date: Date) {
  // Con axios
  
  try {
    const response = await axios.post('https://physiotherapist-api.onrender.com/api/patient_management/patientHealthInfo', {
      steps: steps,
      flights: flights,
      distance: distance,
      date: date
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default { sendLandmarks, sendHealthConnectData}