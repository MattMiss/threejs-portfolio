import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from "three";
import gsap from "gsap";

const CameraController = ({ targetPosition, targetLookAt }: { targetPosition: Vector3; targetLookAt: Vector3 }) => {
    const { camera } = useThree();
    const lookAtRef = useRef(new Vector3().copy(targetLookAt));

    useEffect(() => {
        // Animate camera position
        gsap.to(camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1.5,
            ease: "power2.out",
        });

        // Animate the lookAt target (gradually)
        gsap.to(lookAtRef.current, {
            x: targetLookAt.x,
            y: targetLookAt.y,
            z: targetLookAt.z,
            duration: 1.5,
            ease: "power2.out",
        });

    }, [camera, targetPosition, targetLookAt]);

    // Apply lookAt every frame using useFrame()
    useFrame(() => {
        camera.lookAt(lookAtRef.current);
    });

    return null; // No need to render anything
}

export default CameraController;