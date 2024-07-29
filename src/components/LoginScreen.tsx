import { View, Text, TextInput, Button } from 'react-native';
import styles from '../css/styles';
import { LoginScreenProps } from '../utils/types';
import getPatientData from '../services/getPatientData';


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, tabletNumber, setTabletNumber }) => {

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
