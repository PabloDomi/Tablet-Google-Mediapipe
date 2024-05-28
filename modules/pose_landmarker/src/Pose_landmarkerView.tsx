import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { Pose_landmarkerViewProps } from './Pose_landmarker.types';

const NativeView: React.ComponentType<Pose_landmarkerViewProps> =
  requireNativeViewManager('Pose_landmarker');

export default function Pose_landmarkerView(props: Pose_landmarkerViewProps) {
  return <NativeView {...props} />;
}
