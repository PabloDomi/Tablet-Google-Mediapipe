import * as React from 'react';

import { Pose_landmarkerViewProps } from './Pose_landmarker.types';

export default function Pose_landmarkerView(props: Pose_landmarkerViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
