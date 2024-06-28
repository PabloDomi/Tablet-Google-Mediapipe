import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { startPoseLandmarker } from './modules/tabletMediapipe'
import React, { useEffect, useState } from 'react';
import Tablet_mediapipeView from './modules/tabletMediapipe/src/tablet_mediapipeView';
import useHealthData from './src/hooks/useHealthData';

export default function App() {

  const [showMediapipe, setShowMediapipe] = useState<boolean>(false);
  const [landmarks, setLandmarks] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const { steps, flights, distance, readData } = useHealthData(date)


  const handleCloseMediapipe = () => {
    setShowMediapipe(false);
    const results = startPoseLandmarker();
    setLandmarks(results);
    let pose = 0;
    let landmark = 0;
    for (let i = 0; i < landmarks.length; i++) {
      console.log(`Pose: ${pose}\n\tLandmark ${landmark}:\n\t ${results[i]}`);
      if (i % 32 === 0) {
        pose++;
        landmark = 0;
      } else {
        landmark++;
      }
    }
    const currentDate: Date = new Date();
    setDate(currentDate);
  }

  useEffect(() => {
    readData();
  }, [date]);

  console.log("Steps: ", steps, "Flights: ", flights, "Distance: ", distance)

  // Usar "landmarks" para enviarlos a la api y hacer los cálculos del módulo de la IA para, posteriormente, 
  // representarlos en el dashboard de la aplicación web

  // Usar "steps", "flights" y "distance" y la date de ese momento, para enviarlos a la base de datos y 
  // representarlos en el dashboard de la aplicación web


  return (
    <>
      {!showMediapipe &&
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <Button title="Start Mediapipe" onPress={() => setShowMediapipe(true)} />
        </View>
      }
      {showMediapipe &&
        <>
          <View style={styles.container}>
            <Tablet_mediapipeView style={{ flex: 1, width: '100%', height: '80%' }} />
          </View>
          <View style={styles.react}>
            <Button title="Stop Mediapipe" onPress={handleCloseMediapipe} />
            <StatusBar style="auto" />
          </View>
        </>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  react: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
