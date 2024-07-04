import axios from "axios";

async function checkLogin (tabletNumber: number) {
    try {
        const response = await axios.get(`https://physiotherapist-api.onrender.com/api/patient_management/checkTabletLogin/${tabletNumber}`);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

async function getRoutine (routineId: number) {
    try {
        const response = await axios.get(`https://physiotherapist-api.onrender.com/api/patient_management/getRoutineById/${routineId}`);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export default { checkLogin, getRoutine }