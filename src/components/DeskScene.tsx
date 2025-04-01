import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useCameraView } from "../context/CameraContext";
import VolumeKnob from "./VolumeKnob";
import TooltipLine from "./TooltipLine";
import MonitorScreen from "./MonitorScreen";
import SpeakerSwitch from "./SpeakerSwitch";
import { useAudio } from "../context/AudioContext";
import { useInteractable } from "../context/InteractableContext";

type GLTFResult = {
  scene: Group;
};

const objectLines = {
    speaker: { startPoint: [-27, 30, -5], endPoint: [-27, 40, -5]},
    monitor: { startPoint: [0, 42, -13], endPoint: [0, 48, -13]},
}

const onLightMat = new MeshStandardMaterial({ color: "green", emissive: "green", emissiveIntensity: 2});
const offLightMat = new MeshStandardMaterial({ color: "red", emissive: "red", emissiveIntensity: 2});

export default function DeskSceneNew() {
    const { cameraViews, cameraView, setCameraView } = useCameraView();
    const {songVolume, setSongVolume, isSongPlaying, setIsSongPlaying} = useAudio();
    const {currentInteractable, setCurrentInteractable, highlightedMesh, setHighlightedMesh} = useInteractable();
    const { scene } = useGLTF("/models/DeskNew.gltf") as GLTFResult;
    
    // Load speakers
    const speakerLeft = useMemo(() => scene.getObjectByName('SpeakerLeft')?.clone() as Mesh, [scene]);
    const speakerRight = useMemo(() => scene.getObjectByName('SpeakerRight')?.clone() as Mesh, [scene]);
    const volumeKnob = useMemo(() => speakerLeft?.getObjectByName('VolumeKnob') as Mesh, [speakerLeft]);
    const speakerSwitch = useMemo(() => speakerLeft?.getObjectByName('SpeakerSwitch') as Mesh, [speakerLeft]);
    const speakerText = useMemo(() => speakerLeft?.getObjectByName('SpeakerText') as Mesh, [speakerLeft]);
    const speakerLeftLight = useMemo(() => speakerLeft?.getObjectByName('SpeakerLeft_2') as Mesh, [speakerLeft]);
    const speakerRightLight = useMemo(() => speakerRight?.getObjectByName('SpeakerRight_2') as Mesh, [speakerRight]);

    // load the rest
    const desk = useMemo(() => scene.getObjectByName('Desk')?.clone() as Mesh, [scene]);
    const monitor = useMemo(() => scene.getObjectByName('Monitor')?.clone() as Mesh, [scene]);

    const hoveredMesh = useRef<Mesh | null>(null);
    const [isVolumeChanging, setIsVolumeChanging] = useState(false);

    useEffect(() => {
        setCameraView(cameraViews.main);
    },[]);

    useEffect(() => {
        if (speakerText){
            const speakerTextMat = speakerText.material as MeshStandardMaterial;
            speakerTextMat.transparent = true;
        }
    }, [speakerText]);

    useEffect(() => {
        console.log(songVolume);
    },[songVolume]);

    useEffect(() => {
        if (speakerLeftLight && speakerRightLight){
            speakerLeftLight.material = isSongPlaying ? onLightMat : offLightMat;
            speakerRightLight.material = isSongPlaying ? onLightMat : offLightMat;
        }
    }, [isSongPlaying]);

    useEffect(() => {
        console.log(cameraView.name)
    }, [cameraView])

    const onMeshClick = (mesh : Mesh) => {
        console.log(mesh.name)
        if (isVolumeChanging) return;
        switch (mesh.name){          
            case "Monitor":
                if (cameraView.name === cameraViews.monitor.name) return;
                    setCameraView(cameraViews.monitor);
                    break;
            case "SpeakerLeft_1":
                if (cameraView.name === cameraViews.speaker.name) return;
                    setCameraView(cameraViews.speaker);
                    break;
            case "Desk":
                if (cameraView.name === cameraViews.main.name) return;
                    setCameraView(cameraViews.main);
                    break;
            case "SpeakerSwitch":
                if (cameraView.name === cameraViews.speaker.name){
                    setIsSongPlaying(!isSongPlaying);
                }
                break;
        }
    }

    const OnObjectHoverOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (isVolumeChanging) return;

        const mesh = e.object as Mesh;
        console.log(mesh.name);
        if (cameraView === cameraViews.speaker){
            if (mesh.name === "SpeakerLeft_1" || mesh.name === "SpeakerLeft_2") return;
        }
        if (mesh.name === cameraView.name || mesh.name === "SpeakerLeft_2") return;
        if (hoveredMesh.current !== mesh){
            setHighlightedMesh(mesh);
            hoveredMesh.current = mesh;
            document.body.style.cursor = "pointer";
        }
    };
    
    const OnObjectHoverOut = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (isVolumeChanging) return;

        const mesh = e.object as Mesh;
        if (mesh.name === "SpeakerLeft_2") return;
        if (hoveredMesh.current === mesh){
            setHighlightedMesh(null);
            hoveredMesh.current = null;
            document.body.style.cursor = "auto";
        }
    };
    
    const OnObjectClick = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const mesh = e.object as Mesh;
        setCurrentInteractable(mesh);
        if (mesh.name === cameraView.name || mesh.name === "SpeakerLeft_2") return;
        setHighlightedMesh(null);
        onMeshClick(mesh);
        //document.body.style.cursor = "auto";
    };

    return (
        <>
            <TooltipLine 
                show={!isVolumeChanging && highlightedMesh?.name === "SpeakerLeft_1"} 
                startPoint={[objectLines.speaker.startPoint[0], objectLines.speaker.startPoint[1], objectLines.speaker.startPoint[2]]} 
                endPoint={[objectLines.speaker.endPoint[0], objectLines.speaker.endPoint[1], objectLines.speaker.endPoint[2]]}
                text='Music'
            />
            <TooltipLine 
                show={!isVolumeChanging && highlightedMesh?.name === "Monitor"} 
                startPoint={[objectLines.monitor.startPoint[0], objectLines.monitor.startPoint[1], objectLines.monitor.startPoint[2]]} 
                endPoint={[objectLines.monitor.endPoint[0], objectLines.monitor.endPoint[1], objectLines.monitor.endPoint[2]]}
                text='Portfolio'
            />
            <primitive 
                object={speakerLeft} 
                onPointerOver={OnObjectHoverOver}
                onPointerOut={OnObjectHoverOut}
                onPointerDown={OnObjectClick}
            />
            {volumeKnob && 
                <VolumeKnob 
                    volumeKnob={volumeKnob} 
                    canInteract={cameraView.name === cameraViews.speaker.name}
                    onChange={setSongVolume} 
                    isInteracting={currentInteractable === volumeKnob}
                    setIsVolumeChanging={setIsVolumeChanging}
                    stopInteracting={() => setCurrentInteractable(null)}
                />
            }
            {speakerSwitch &&
                <SpeakerSwitch 
                    speakerSwitch={speakerSwitch}
                    speakersOn={isSongPlaying}
                />
            }
            <primitive 
                object={speakerRight} 
                onPointerOver={OnObjectHoverOver}
                onPointerOut={OnObjectHoverOut}
                onPointerDown={OnObjectClick}
            />
            <primitive 
                object={desk} 
                onPointerOver={OnObjectHoverOver}
                onPointerOut={OnObjectHoverOut}
                onPointerDown={OnObjectClick}
            />
            <primitive 
                object={monitor} 
                onPointerOver={OnObjectHoverOver}
                onPointerOut={OnObjectHoverOut}
                onPointerDown={OnObjectClick}
            />
            {/* <MonitorScreen /> */}
            {monitor && <MonitorScreen isInFocus={cameraView.name === cameraViews.monitor.name} />}
        </>
    );
}