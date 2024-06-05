import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { startPoseLandmarker } from './modules/tabletMediapipe'
import React, { useState } from 'react';
import Tablet_mediapipeView from './modules/tabletMediapipe/src/tablet_mediapipeView';

export default function App() {

  const [showMediapipe, setShowMediapipe] = useState<boolean>(false);
  const [landmarks, setLandmarks] = useState<string[]>([]);


  const handleCloseMediapipe = () => {
    setShowMediapipe(false);
    const results = startPoseLandmarker();
    let pose = 0;
    let landmark = 0;
    for (let i = 0; i < results.length; i++) {
      console.log(`Pose: ${pose}\n\tLandmark ${landmark}:\n\t ${results[i]}`);
      if (i % 32 === 0) {
        pose++;
        landmark = 0;
      } else {
        landmark++;
      }
    }
    setLandmarks(results);
  }

  // Usar "landmarks" para llamar a la api de IA y obtener la información de la pose

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
