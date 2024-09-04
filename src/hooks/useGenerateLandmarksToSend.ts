

export default function useGenerateLandmarksToSend(results: string[]) {
    
   
    const landmarksArray: React.SetStateAction<string[]> = []; // Array para almacenar los landmarks y luego actualizar el estado

    // Recorre el Array de resultados y los añade al Array de landmarks
    for (let i = 0; i < results.length; i++) {
        const landmarksAdd = (`${results[i]}`);
        landmarksArray.push(landmarksAdd);
    }

    return { landmarksArray }
}
