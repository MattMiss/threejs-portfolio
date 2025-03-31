import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {Mesh} from "three";


// Props for our reusable highlightable mesh
export type VolumeKnobProps = {
    volumeKnob: Mesh;
    canInteract: boolean;
    minValue?: number;
    maxValue?: number;
    onChange: (value: number) => void;
    isInteracting: boolean;
    setIsVolumeChanging: (value: boolean) => void;
    stopInteracting: () => void;
}

export default function VolumeKnob (props: VolumeKnobProps) {

    const {
        volumeKnob,
        canInteract = false,
        minValue = 0,
        maxValue = 1,
        onChange,
        isInteracting,
        setIsVolumeChanging,
        stopInteracting
    } = props;

    const knobRef = useRef<Mesh>(volumeKnob);
    const totalRotation = useRef(0);


    useEffect(() => {
        if (!canInteract) return;
        
        const handlePointerMove = (event: PointerEvent) => {
            if (!isInteracting || !knobRef.current) return;
        
            const deltaY = event.movementY * 0.01;
            let newRotation = totalRotation.current + deltaY;
            newRotation = Math.max(-Math.PI * 0.75, Math.min(Math.PI * 0.75, newRotation));
            totalRotation.current = newRotation;
        
            const newValue =
                maxValue -
                ((newRotation + Math.PI * 0.75) / (Math.PI * 1.5)) * (maxValue - minValue);
            onChange(newValue);
        };
    
        const handlePointerUp = () => {
            setIsVolumeChanging(false);
            stopInteracting();
        };
    
        if (isInteracting) {
            setIsVolumeChanging(true);
            document.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerup", handlePointerUp);
        }
    
        return () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
        };
      }, [isInteracting, minValue, maxValue, onChange]);
    
    useEffect(() => {
        document.body.style.cursor = isInteracting ? "grabbing" : "auto";
    }, [isInteracting]);

    useFrame(() => {
        if (knobRef.current) {
            knobRef.current.rotation.z = totalRotation.current;
        }
    });
  
    return (
        <> 
        </>       
    );
};