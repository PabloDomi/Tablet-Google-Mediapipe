import { EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to tablet_mediapipe.web.ts
// and on native platforms to tablet_mediapipe.ts
import tablet_mediapipeModule from './src/tablet_mediapipeModule';
import tablet_mediapipeView from './src/tablet_mediapipeView';
import { ChangeEventPayload, tablet_mediapipeViewProps } from './src/tablet_mediapipe.types';

export type onLandmarkReceivedEvent = {
  data: string;
}

export function startPoseLandmarker(): string[] {
  return tablet_mediapipeModule.getPoseResults();
}

export function getFramesPerSecond(): number {
  return tablet_mediapipeModule.getFramesPerSecond();
}

const emitter = new EventEmitter(tablet_mediapipeModule);

export function addChangeListener(listener: (event: onLandmarkReceivedEvent) => void): Subscription {
  return emitter.addListener<onLandmarkReceivedEvent>('onLandmarkReceived', listener);
}

export { tablet_mediapipeView, tablet_mediapipeViewProps, ChangeEventPayload };
