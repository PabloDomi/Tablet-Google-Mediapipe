import axios from "axios";

async function sendLandmarks(landmarks: string[], date: Date) {
  // Con axios
  try {
    const response = await axios.post('https://physiotherapist-api.onrender.com/api/patient_management/patientLandmarks', {
      landmarks: landmarks,
      date: date
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