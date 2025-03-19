import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, Object3D } from "three";
import HighlightableMesh from "./HighlightableMesh";
import * as THREE from 'three';

type GLTFResult = {
  scene: Group;
};

// Create a type to store mesh data with more attributes if needed
type MeshData = {
    mesh: Mesh;
    name: string;
};

interface DeskSceneProps {
    speakersOn: boolean;
    canHover: boolean;
    onMeshClick: (meshName: string) => void;
    currentView: string;
    setHighlightedMesh: ( mesh: Mesh | null) => void;
}

const onLightMat = new THREE.MeshStandardMaterial({ color: "green", emissive: "green", emissiveIntensity: 10});
const offLightMat = new THREE.MeshStandardMaterial({ color: "red", emissive: "red", emissiveIntensity: 10});

const DeskScene = ({ speakersOn, canHover, onMeshClick, currentView, setHighlightedMesh}: DeskSceneProps) => {
    const { scene } = useGLTF("/models/Desk.gltf") as GLTFResult;
    const hoveredMesh = useRef<Mesh | null>(null);
    const [speakerLight, setSpeakerLight] = useState<THREE.Mesh>(null!);
    const [speakerLightMat, setSpeakerLightMat] = useState<THREE.MeshStandardMaterial>(speakersOn ? onLightMat : offLightMat);

    useEffect(() => {
        if (!speakerLight) return;
        console.log(speakersOn)
        setSpeakerLightMat(speakersOn ? onLightMat : offLightMat);
    }, [speakersOn, speakerLight]);

    const meshData = useMemo(() => {
        const extractedMeshes: MeshData[] = [];
        scene.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
                if (child.name === "Speakers_2"){
                    setSpeakerLight(child);
                }else{
                    extractedMeshes.push({ mesh: child, name: child.name });
                }
            }
        });
        return extractedMeshes;
    }, [scene]);

    const OnObjectHoverOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const mesh = e.object as Mesh;
        if (mesh.name === currentView || mesh.name === "Speakers_2") return;
        if (hoveredMesh.current !== mesh){
            setHighlightedMesh(mesh);
            hoveredMesh.current = mesh;
            document.body.style.cursor = "pointer";
        }
    };

    const OnObjectHoverOut = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const mesh = e.object as Mesh;
        if (mesh.name === "Speakers_2") return;
        if (hoveredMesh.current === mesh){
            setHighlightedMesh(null);
            hoveredMesh.current = null;
            document.body.style.cursor = "auto";
        }
    };

    const OnObjectClick = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const mesh = e.object as Mesh;
        if (mesh.name === currentView || mesh.name === "Speakers_2") return;
        onMeshClick(mesh.name);
        setHighlightedMesh(null);
        document.body.style.cursor = "auto";
    };

    // const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshStandardMaterial({ color: "orange" })


    return (
        <>           
            {meshData.map(({ mesh, name }) => (
                <HighlightableMesh
                    key={mesh.uuid}
                    geometry={mesh.geometry}
                    material={mesh.material}
                    position={mesh.position.clone()}
                    rotation={mesh.rotation.clone()}
                    scale={mesh.scale.clone()}
                    name={name} // Not strictly needed, but you can keep it for logs
                    onPointerOver={OnObjectHoverOver}
                    onPointerOut={OnObjectHoverOut}
                    onClick={OnObjectClick}
                    hovered={canHover && hoveredMesh.current?.name === name}
                />
            ))}
            {speakerLight && <mesh 
                geometry={speakerLight.geometry}
                material={speakerLightMat}
            />}
            
            {/* Two spinning boxes side by side */}
            {/* <HighlightableMesh
                geometry={geometry}
                material={material}
                position={[-1.5, 0, 0]}
                hovered={true}
            />
            <HighlightableMesh
                geometry={geometry}
                material={material}
                position={[1.5, 0, 0]}
            /> */}
        </>
    );
};

export default DeskScene;
