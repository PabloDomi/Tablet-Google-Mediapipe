import { View, Text, TextInput, Button } from 'react-native';
import styles from '../css/styles';
import { CheckTabletTypes, LoginScreenProps } from '../utils/types';
import getPatientData from '../services/getPatientData';


const LoginScreen: React.FC<LoginScreenProps> = ({ setPatientData, routine, setRoutine, tabletNumber, setTabletNumber, setIsAuthenticated }) => {

    const handleRetrieveRoutine = async (routine_id: number) => {
        if (routine.name === '¡Rutina Diaria Completada!') {
            setRoutine(routine);
            return
        }
        const response = await getPatientData.getRoutine(routine_id);
        setRoutine({
            name: response.name,
            description: response.description,
            estimatedTime: response.estimatedTime,
            exercises: response.exercises,
        });
    }

    const onLogin = async (data: CheckTabletTypes) => {
        await setPatientData({
            routine_id: data.routine_id,
            patient_id: data.patient_id,
            treatment_time: data.treatment_time,
            treatment_cadence: data.treatment_cadence
        });
        handleRetrieveRoutine(data.routine_id);
        setIsAuthenticated(true)
    }

    const handleLogin = async () => {
        if (tabletNumber === 0) {
            return alert('Introduce un número de tablet válido')
        }

        if (tabletNumber > 0) {
            const response = await getPatientData.checkLogin(tabletNumber);
            if (response) {
                onLogin(response);
            } else {
                alert('Introduce un número de tablet válido');
            }
        } else {
            alert('Error en el Login');
        }
    };

    return (
        <View style={styles.loginMainContainer}>
            <View style={styles.loginContainer}>
                <Text style={styles.title}>Ingrese el número de la tablet</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Número de tablet"
                    value={tabletNumber.toString()}
                    onChangeText={(text) => setTabletNumber(parseInt(text))}
                    keyboardType="numeric"
                />
                <Button title="Login" onPress={handleLogin} />
            </View>
        </View>
    );
};

export default LoginScreen;
