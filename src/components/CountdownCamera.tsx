import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import styles from '../css/styles';

const CountdownCamera = ({ onCountdownFinish }: { onCountdownFinish: () => void }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [countdown, setCountdown] = useState(10);

    const countdownAnimation = useSharedValue(10);

    useEffect(() => {
        if (countdown === 0) {
            onCountdownFinish();
        } else if (countdown > 0 && permission?.granted) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
                countdownAnimation.value = withTiming(countdown - 1, {
                    duration: 1000,
                    easing: Easing.linear,
                });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown, onCountdownFinish, permission]);


    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.loginContainer}>
                <Text style={styles.exerciseTitle}>Necesitamos tu permiso para mostrar la cámara</Text>
                <TouchableOpacity style={styles.startRoutineButton} onPress={requestPermission} >
                    <Text style={styles.startRoutineButtonText}>Dar permisos</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={estilos.camera} facing='front' />
            <View style={estilos.countdownContainer}>
                <Animated.Text style={estilos.countdownText}>
                    {countdown}
                </Animated.Text>
            </View>
        </View>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    countdownContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownText: {
        fontSize: 72,
        color: 'white',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
});

export default CountdownCamera;
