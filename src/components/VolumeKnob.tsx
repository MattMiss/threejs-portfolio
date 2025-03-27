import { useEffect, useRef, useState } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

type GLTFResult = {
    scene: THREE.Group;
};

// Props for our reusable highlightable mesh
export type VolumeKnobProps = ThreeElements["mesh"] & {
    canInteract: boolean;
    minValue?: number;
    maxValue?: number;
    onChange: (value: number) => void;
    onInteracting: (interacting: boolean) => void;
}

export default function VolumeKnob (props: VolumeKnobProps) {

    const {
        canInteract = false,
        minValue = 0,
        maxValue = 1,
        onChange,
        onInteracting,
        rotation = [0, 0, 0],
        ...rest
    } = props;

    const { scene } = useGLTF("/models/VolumeKnob.gltf") as GLTFResult;
    const volumeKnob = scene.getObjectByName("VolumeKnob") as THREE.Mesh;
    if (!volumeKnob) {
        console.error("VolumeKnob mesh not found in the GLTF file!");
    }

    const knobRef = useRef<THREE.Mesh>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hovered, setIsHovered] = useState(false);
    const initialQuaternion = useRef(new THREE.Quaternion());
    const targetQuaternion = useRef(new THREE.Quaternion());

    const totalRotation = useRef(0);

    useEffect(() => {
        if (knobRef.current) {
          let rotationArray: [number, number, number];
    
          if (rotation instanceof THREE.Euler) {
            // Convert Euler to an array
            rotationArray = [rotation.x, rotation.y, rotation.z];
          } else if (Array.isArray(rotation)) {
            // Use provided array
            rotationArray = rotation as [number, number, number];
          } else {
            throw new Error("Invalid rotation prop. Expected an array or THREE.Euler.");
          }
    
          // Apply the initial rotation from props
          const euler = new THREE.Euler(...rotationArray);
          initialQuaternion.current.setFromEuler(euler);
          knobRef.current.quaternion.copy(initialQuaternion.current);
        }
      }, [rotation]);
  
    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            if (!isDragging || !knobRef.current) return;
    
            const deltaY = event.movementY * 0.01; // Adjust sensitivity (left/right)
            let newRotation = totalRotation.current + deltaY; // Invert for natural feel
    
            // Clamp rotation to -135° to +135° (prevents infinite rotation)
            newRotation = Math.max(-Math.PI * 0.75, Math.min(Math.PI * 0.75, newRotation));
            totalRotation.current = newRotation;
            //setRotation(newRotation);
    
            // Map rotation to a value (0-100)
            const newValue = maxValue - ((newRotation + Math.PI * 0.75) / (Math.PI * 1.5)) * (maxValue - minValue);
            //console.log(newValue)
            onChange(newValue);
        };
  
        const handlePointerUp = () => {
            setIsDragging(false);
            onInteracting(false);
            document.body.style.cursor = "auto";
        };
    
        if (isDragging) {
            document.body.style.cursor = "grabbing";
            document.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerup", handlePointerUp);
        }
    
        return () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
        };
    }, [isDragging, rotation, minValue, maxValue, onChange, onInteracting]);

    useEffect(() => {
        if (!isDragging){
            document.body.style.cursor = hovered ? "pointer" : "auto";
        }
    }, [hovered, isDragging]);
  
    // Apply rotation to the knob
    useFrame(() => {
        if (knobRef.current) {
          // Apply rotation around LOCAL Y-axis while preserving original rotation
          targetQuaternion.current.setFromAxisAngle(new THREE.Vector3(0, 0, 1), totalRotation.current); // Rotate around local Y-axis
          knobRef.current.quaternion.copy(initialQuaternion.current).multiply(targetQuaternion.current);
        }
    });
  
    return (
        <mesh
            ref={knobRef}
            geometry={volumeKnob.geometry}
            material={volumeKnob.material}
            onPointerDown={() => {
                if (!canInteract) return;

                setIsDragging(true);
                onInteracting(true);                
            }}
            onPointerEnter={() => {
                if (!canInteract) return;

                setIsHovered(true);               
            }}
            onPointerLeave={() => {
                if (!canInteract) return;
                
                setIsHovered(false);           
            }}
            {...rest}
        />
    );
};