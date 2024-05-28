import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to Pose_landmarker.web.ts
// and on native platforms to Pose_landmarker.ts
import Pose_landmarkerModule from './src/Pose_landmarkerModule';
import Pose_landmarkerView from './src/Pose_landmarkerView';
import { ChangeEventPayload, Pose_landmarkerViewProps } from './src/Pose_landmarker.types';

// Get the native constant value.
export const PI = Pose_landmarkerModule.PI;

export function hello(): string {
  return Pose_landmarkerModule.hello();
}

export async function setValueAsync(value: string) {
  return await Pose_landmarkerModule.setValueAsync(value);
}

const emitter = new EventEmitter(Pose_landmarkerModule ?? NativeModulesProxy.Pose_landmarker);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { Pose_landmarkerView, Pose_landmarkerViewProps, ChangeEventPayload };
