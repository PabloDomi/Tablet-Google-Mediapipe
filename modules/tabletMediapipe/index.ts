import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to tablet_mediapipe.web.ts
// and on native platforms to tablet_mediapipe.ts
import tablet_mediapipeModule from './src/tablet_mediapipeModule';
import tablet_mediapipeView from './src/tablet_mediapipeView';
import { ChangeEventPayload, tablet_mediapipeViewProps } from './src/tablet_mediapipe.types';

// Get the native constant value.
export const PI = tablet_mediapipeModule.PI;

export function startPoseLandmarker(): string {
  return tablet_mediapipeModule.startPoseLandmarker();
}

export async function setValueAsync(value: string) {
  return await tablet_mediapipeModule.setValueAsync(value);
}

const emitter = new EventEmitter(tablet_mediapipeModule ?? NativeModulesProxy.tablet_mediapipe);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { tablet_mediapipeView, tablet_mediapipeViewProps, ChangeEventPayload };
