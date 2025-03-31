// CameraContext.tsx
import { createContext, useContext } from 'react'
import { CameraView } from '../types/types';


type CameraContextType = {
    cameraViews: {
        main: CameraView,
        monitor: CameraView,
        speaker: CameraView
    };
    cameraView: CameraView;
    setCameraView: (view: CameraView) => void;
}

export const CameraContext = createContext<CameraContextType | null>(null)

export const useCameraView = () => {
    const ctx = useContext(CameraContext);
    if (!ctx) throw new Error('useCameraView must be used within CameraProvider');
    return ctx;
}
