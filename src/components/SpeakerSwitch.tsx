import { useEffect, useRef, useState } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, Text } from "@react-three/drei";

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
    const switchPosition=new THREE.Vector3(-23.35, 22.25, -2.5);
    const switchRotation=new THREE.Euler(0, Math.PI * 0.16, 0);
    const onTextLocation = new THREE.Vector3(0, 0.85, 0.1);
    const offTextLocation = new THREE.Vector3(0, -0.85, 0.1);
    const textColor = new THREE.Color(0.4, 0.4, 0.4);

    // Load GLTF
    const { scene } = useGLTF("/models/SpeakerSwitch.gltf") as GLTFResult;
    const speakerSwitch = scene.getObjectByName("SpeakerSwitch") as THREE.Mesh;
    if (!speakerSwitch) {
        console.error("⚠️ SpeakerSwitch mesh not found in the GLTF file!");
    }

    const switchRef = useRef<THREE.Mesh>(null);
    const initialized = useRef(false); // used so quarternion rotation doesn't occur until the switch is initialized and initial rotation is set
    const [readyToInit, setReadyToInit] = useState(false)
    const [hovered, setIsHovered] = useState(false);
    const initialQuaternion = useRef(new THREE.Quaternion());
    const targetQuaternion = useRef(new THREE.Quaternion());
    const currentQuaternion = useRef(new THREE.Quaternion());
    const rotationAxis = new THREE.Vector3(1, 0, 0);
    const rotationAngle = Math.PI / 10;

    // Mark ready on the next frame after mounting
    useEffect(() => {
        let frame: number
        if (switchRef.current) {
            frame = requestAnimationFrame(() => setReadyToInit(true))
        }
        return () => cancelAnimationFrame(frame)
    }, [])

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
        if (!initialized.current || !switchRef.current) return;
      
        targetQuaternion.current.copy(initialQuaternion.current);
    
        if (!speakersOn) {
            const offsetRotation = new THREE.Quaternion();
            offsetRotation.setFromAxisAngle(rotationAxis, rotationAngle);
            targetQuaternion.current.multiply(offsetRotation);
        }
    }, [speakersOn])

    useFrame(() => {
        if (switchRef.current && readyToInit && !initialized.current) {
          // Capture initial rotation
          initialQuaternion.current.copy(switchRef.current.quaternion)
          currentQuaternion.current.copy(switchRef.current.quaternion)
          initialized.current = true
      
          // Force set target immediately based on current state
          updateTargetQuaternion(speakersOn)
        }
      
        // Only slerp once initialized
        if (initialized.current && switchRef.current) {
          currentQuaternion.current.slerp(targetQuaternion.current, 0.2)
          switchRef.current.quaternion.copy(currentQuaternion.current)
        }
    })

    const updateTargetQuaternion = (isOn: boolean) => {
        if (!initialized.current) return
      
        const rotationAxis = new THREE.Vector3(1, 0, 0)
        const rotationAngle = Math.PI / 10
      
        targetQuaternion.current.copy(initialQuaternion.current)
      
        if (!isOn) {
          const offsetRotation = new THREE.Quaternion()
          offsetRotation.setFromAxisAngle(rotationAxis, rotationAngle)
          targetQuaternion.current.multiply(offsetRotation)
        }
    }

    useEffect(() => {
        updateTargetQuaternion(speakersOn)
      }, [speakersOn])

    const handleClick = () => {
        if (!canInteract) return;
        onSwitch(!speakersOn);
    };

    return (
        <group position={switchPosition} rotation={switchRotation}>   
            <Text 
                color={textColor}
                anchorX="center" 
                anchorY="middle"
                position={onTextLocation}
                fontSize={0.2}
            >
                ON
            </Text>      
            <Text 
                color={textColor}
                anchorX="center" 
                anchorY="middle"
                position={offTextLocation}
                fontSize={0.2}
            >
                OFF
            </Text>    
            <mesh
                ref={switchRef}
                geometry={speakerSwitch.geometry}
                material={speakerSwitch.material}
                onPointerDown={handleClick}
                onPointerEnter={() => canInteract && setIsHovered(true)}
                onPointerLeave={() => canInteract && setIsHovered(false)}
            {...rest}
            />
        </group>        
    );
}
