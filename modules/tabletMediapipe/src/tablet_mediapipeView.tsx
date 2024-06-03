import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { tablet_mediapipeViewProps } from './tablet_mediapipe.types';

const NativeView: React.ComponentType<tablet_mediapipeViewProps> =
  requireNativeViewManager('tablet_mediapipe');

export default function tablet_mediapipeView(props: tablet_mediapipeViewProps) {
  return <NativeView {...props} />;
}
