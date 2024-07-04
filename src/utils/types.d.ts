import { SetStateAction } from "react";

export interface RoutineType {
  name?: string;
  description?: string;
  estimatedTime?: number;
  exercises?: ExerciseType[];
}

export interface ExerciseType {
  id?: string;
  name?: string;
  description?: string;
}

export interface CheckTabletTypes {
  routine_id: number;
  patient_id: number;
  treatment_time: number;
  treatment_cadence: number;
}
export interface LoginScreenProps {
    onLogin: (response: CheckTabletTypes) => void;
    tabletNumber: number;
    setTabletNumber: SetStateAction
}

export interface getRoutineTypes {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  user_id: number;
  patient_id: number;
}