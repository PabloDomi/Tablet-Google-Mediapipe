import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
// import { startPoseLandmarker } from './modules/pose_landmarker'
import { useState } from 'react';
import { startPoseLandmarker } from './modules/tabletMediapipe';

export default function App() {

  const [showMediapipe, setShowMediapipe] = useState<boolean>(false);

  return (
    <>
      {!showMediapipe &&
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <Button title="Start Mediapipe" onPress={() => setShowMediapipe(true)} />
        </View>
      }
      {showMediapipe &&
        <View style={styles.container}>
          <Text>{startPoseLandmarker()}</Text>
          <Button title="Stop Mediapipe" onPress={() => setShowMediapipe(false)} />
          <StatusBar style="auto" />
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
