import { useEffect, useRef, useState } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

type GLTFResult = {
    scene: THREE.Group;
};

// Props for our reusable highlightable mesh
export type SpeakerSwitchProps = ThreeElements["mesh"] & {
    canInteract: boolean;
    speakersOn: boolean;
    onSwitch: (value: boolean) => void;
};

export default function SpeakerSwitch(props: SpeakerSwitchProps) {
    const { canInteract = false, speakersOn, onSwitch, ...rest } = props;

    // Load GLTF
    const { scene } = useGLTF("/models/SpeakerSwitch.gltf") as GLTFResult;
    const speakerSwitch = scene.getObjectByName("SpeakerSwitch") as THREE.Mesh;
    if (!speakerSwitch) {
        console.error("⚠️ SpeakerSwitch mesh not found in the GLTF file!");
    }

    const switchRef = useRef<THREE.Mesh>(null);
    const [hovered, setIsHovered] = useState(false);
    const initialQuaternion = useRef(new THREE.Quaternion());
    const targetQuaternion = useRef(new THREE.Quaternion());
    const currentQuaternion = useRef(new THREE.Quaternion());

    useEffect(() => {
        document.body.style.cursor = hovered ? "pointer" : "auto";
    }, [hovered]);

    useEffect(() => {
        if (switchRef.current) {
            // 🔥 Store the initial orientation when the switch loads
            initialQuaternion.current.copy(switchRef.current.quaternion);
        }
    }, []);

    useEffect(() => {
        if (switchRef.current) {
            const rotationAxis = new THREE.Vector3(1, 0, 0); // 🔥 Adjust if needed
            const rotationAngle = Math.PI / 10; // 🔥 18 degrees in radians

            // 🔄 Compute the new target quaternion (rotate around its local axis)
            targetQuaternion.current.copy(initialQuaternion.current);
            if (!speakersOn) {
                const offsetRotation = new THREE.Quaternion();
                offsetRotation.setFromAxisAngle(rotationAxis, rotationAngle);
                targetQuaternion.current.multiply(offsetRotation);
            }
        }
    }, [speakersOn]);

    useFrame(() => {
        if (switchRef.current) {
            // 🔄 Smoothly interpolate towards the target quaternion
            currentQuaternion.current.slerp(targetQuaternion.current, 0.2);
            switchRef.current.quaternion.copy(currentQuaternion.current);
        }
    });

    const handleClick = () => {
        if (!canInteract) return;
        onSwitch(!speakersOn);
    };

    return (
        <mesh
            ref={switchRef}
            geometry={speakerSwitch.geometry}
            material={speakerSwitch.material}
            onPointerDown={handleClick}
            onPointerEnter={() => canInteract && setIsHovered(true)}
            onPointerLeave={() => canInteract && setIsHovered(false)}
            {...rest}
        />
    );
}
