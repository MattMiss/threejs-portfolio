import { Line, Html } from "@react-three/drei"
import * as THREE from "three"

interface TooltipLineProps {
  show: boolean
  startPoint: [number, number, number] 
  endPoint: [number, number, number]
  text: string
}

const TooltipLine = ({ show, startPoint, endPoint, text }: TooltipLineProps) => {
  const start = new THREE.Vector3(...startPoint)
  const end = new THREE.Vector3(...endPoint)

  return show ? (
    <>
        {/* Line connecting the object to the tooltip */}
        <Line
            points={[start, end]}
            color="white"
            lineWidth={2}
        />

        {/* Floating Tooltip using <Html> */}
        <Html
            position={[endPoint[0], endPoint[1] + 1, endPoint[2]]} 
            center
            distanceFactor={200} // Adjust tooltip scaling
            style={{
            padding: "5px 10px",
            borderRadius: "5px",
            color: "white",
            fontSize: "12px",
            whiteSpace: "nowrap",
            }}
        >
            {text}
        </Html>
    </>
  ) : null
}

export default TooltipLine
