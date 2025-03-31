import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {Mesh} from "three";

// Props for our reusable highlightable mesh
export type SpeakerSwitchProps = {
    speakerSwitch: Mesh;
    speakersOn: boolean;
};

export default function SpeakerSwitch(props: SpeakerSwitchProps) {
    const { speakerSwitch, speakersOn} = props;
    const switchRef = useRef<Mesh>(speakerSwitch);

    const rotationOffset = Math.PI / 10;

    useFrame(() => {
    if (!switchRef.current) return;

        const targetX = speakersOn ? 0 : rotationOffset;
        switchRef.current.rotation.x += (targetX - switchRef.current.rotation.x) * 0.2;
    });

    return (
        <>
        </>        
    );
}
