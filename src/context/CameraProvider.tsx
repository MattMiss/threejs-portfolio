import { useState, useMemo } from 'react';
import { Vector3 } from 'three';
import { CameraContext } from './CameraContext';
import { CameraView } from '../types/types';


// The actual provider
export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const cameraViews = {
    main: {
      name: 'Desk',
      position: new Vector3(-19, 51, 45),
      lookAt: new Vector3(0, 8.5, -27),
    },
    monitor: {
      name: 'Monitor',
      position: new Vector3(0, 33, 1),
      lookAt: new Vector3(0, 33, -20),
    },
    speaker: {
      name: 'Speakers',
      position: new Vector3(-21, 25, 9),
      lookAt: new Vector3(-29, 24, -14),
    },
  }

  const [cameraView, setCameraView] = useState<CameraView>(cameraViews.main)

  const value = useMemo(
    () => ({ cameraViews, cameraView, setCameraView }),
    [cameraView]
  )

  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>
}
