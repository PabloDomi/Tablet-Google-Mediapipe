import { requireNativeViewManager } from 'expo-modules-core';
import { ViewProps } from 'react-native';
import * as React from 'react';


const NativeView: React.ComponentType<ViewProps> =
  requireNativeViewManager('tablet_mediapipeView');

export default function tablet_mediapipeView(props: ViewProps) {
  return <NativeView {...props} />;
}
