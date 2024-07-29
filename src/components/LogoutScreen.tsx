import { TextInput, View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import styles from "../css/styles";
import { LogoutPassword } from "../utils/constants";
import { useState } from "react";

interface LogoutScreenProps {
    setIsAuthenticated: (value: boolean) => void;
    closeModal: () => void;
    clearPersistentData: () => void;
}


const LogoutScreen = ({ setIsAuthenticated, closeModal, clearPersistentData }: LogoutScreenProps) => {


    // Estado para el password de logout
    const [logoutPassword, setLogoutPassword] = useState<string>('');

    const handleCheckLogout = async () => {
        if (logoutPassword === LogoutPassword) {
            ToastAndroid.show('Sesión cerrada', ToastAndroid.SHORT);
            closeModal();
            setIsAuthenticated(false);
            setLogoutPassword('');
            handleDeletePersistence();
        } else {
            ToastAndroid.show('Código incorrecto', ToastAndroid.SHORT);
        }
    }

    const handleDeletePersistence = async () => {
        await clearPersistentData()
        return ToastAndroid.show('Datos persistentes eliminados', ToastAndroid.SHORT);
    }

    return (
        <View style={{ backgroundColor: '#FFFFFF', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{
                color: '#333',
                fontSize: 24,
                fontWeight: 'bold',
                marginVertical: 10,
                fontFamily: 'system-ui',
                textAlign: 'center'
            }}
            >Ingrese el código para cerrar sesión.</Text>
            <TextInput
                style={styles.input}
                placeholder="Código"
                onChangeText={(text) => setLogoutPassword(text)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{
                    margin: 20,
                    backgroundColor: '#3fe024',
                    padding: 10,
                    borderRadius: 8,
                }}
                    onPress={handleCheckLogout}>
                    <Text style={{ color: '#ffffff', fontSize: 18 }}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    margin: 20,
                    backgroundColor: '#de0e0e',
                    padding: 10,
                    borderRadius: 8,
                }}
                    onPress={() => setLogoutPassword('')}>
                    <Text style={{ color: '#ffffff', fontSize: 18 }}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LogoutScreen;