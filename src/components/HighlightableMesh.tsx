import { Select } from "@react-three/postprocessing";
import { ThreeEvent, ThreeElements } from "@react-three/fiber";
import * as THREE from 'three';

// Props for our reusable highlightable mesh
export type HighlightableMeshProps = ThreeElements["mesh"] & {
    geometry: THREE.BufferGeometry;
    material: THREE.Material | THREE.Material[];
    onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
    onClick?: (e: ThreeEvent<PointerEvent>) => void;
    hovered: boolean
}

export default function HighlightableMesh(props: HighlightableMeshProps) {

    const {
        geometry,
        material,
        onPointerOver,
        onPointerOut,
        onClick,
        hovered,
        ...rest
    } = props

    return (
        // Known to cause hook.js608 Maximum update depth exceeded error
        // https://github.com/pmndrs/react-postprocessing/issues/330
        // Fix waiting: https://github.com/pmndrs/react-postprocessing/pull/237
        <Select enabled={hovered}>
            <mesh
                geometry={geometry}
                material={material}
                {...rest}
                onPointerOver={(e) => {
                    onPointerOver?.(e) // Call the parent’s handler if provided
                }}
                onPointerOut={(e) => {
                    onPointerOut?.(e)
                }}
                onClick={onClick}
            />
        </Select>
    )
}
