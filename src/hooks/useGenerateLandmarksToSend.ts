

export default function useGenerateLandmarksToSend(results: string[]) {
    
    let pose = 0;       // Controla el número de pose
    let landmark = 0;   // Controla el número de landmark
    const landmarksArray: React.SetStateAction<string[]> = []; // Array para almacenar los landmarks y luego actualizar el estado

    // Recorre el Array de resultados y los añade al Array de landmarks
    for (let i = 0; i < results.length; i++) {
        const landmarksAdd = (`Pose: ${pose} - Landmark ${landmark}: ${results[i]}`);
        landmarksArray.push(landmarksAdd);
  
        // Si el landmark es el 32, pasa a la siguiente pose
        if (landmark === 32) {
          pose++;
          landmark = 0;
        }
        // Si no, sigue añadiendo landmarks
        else {
          landmark++;
        }
    }

    return { landmarksArray }
}
