import * as React from 'react';

import { tablet_mediapipeViewProps } from './tablet_mediapipe.types';

export default function tablet_mediapipeView(props: tablet_mediapipeViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
