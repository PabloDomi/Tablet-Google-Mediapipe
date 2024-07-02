export interface RoutineType {
    title?: string;
    description?: string;
    exercises?: ExerciseType[];
  }
  
export interface ExerciseType {
    id?: string;
    name?: string;
    details?: string;
    estimatedTime?: string;
  }