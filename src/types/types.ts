import { Vector3 } from 'three';

export type CameraView = {
    name: string;
    position: Vector3; 
    lookAt: Vector3;
}