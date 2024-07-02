import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../css/styles';

interface LoginScreenProps {
    onLogin: (tabletNumber: number) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [tabletNumber, setTabletNumber] = useState<number>(0);

    const handleLogin = () => {
        if (tabletNumber > 0) {
            onLogin(tabletNumber);
        } else {
            alert('Introduce un número de tablet válido');
        }
    };

    return (
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
    );
};

export default LoginScreen;
