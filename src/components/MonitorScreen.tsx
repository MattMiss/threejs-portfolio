import { Html } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
import IndexPage from "../portfolio/pages";

interface MonitorProps {
    isInFocus: boolean;    
}

const MonitorScreen = ({isInFocus} : MonitorProps) => {
  const screenRef = useRef<Mesh>(null);

  return (
    <mesh ref={screenRef} position={[0, 33.85, -20]}>
      {/* Screen Shape */}
      {/* <planeGeometry args={[3, 1.5]} /> */}
      <meshStandardMaterial>
        <Html 
          transform 
          position={[0, 33.85, -13.12]}
          occlude="raycast"
          style={{ zIndex: 1 }}
        >
            <div
                style={{
                height: 590,
                width: 1210,
                background: "black",
                pointerEvents: isInFocus ? "all" : "none",
                zIndex: 1
                }}
            >
                <IndexPage />
          </div>
        </Html>
      </meshStandardMaterial>
    </mesh>
  );
};

export default MonitorScreen;
