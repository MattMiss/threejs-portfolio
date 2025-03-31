import { Html } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Mesh } from "three";
//import IndexPage from "../portfolio/pages";
import Desktop from "./Desktop";

interface MonitorProps {
    isInFocus: boolean;    
}

const MonitorScreen = ({isInFocus} : MonitorProps) => {
  const screenRef = useRef<Mesh>(null);
  const portalRef = useRef<HTMLElement>(null!)

  useEffect(() => {
    portalRef.current = document.getElementById('monitor-dom')!
  }, [])

  return (
    <mesh ref={screenRef} position={[0, 33.85, -20]}>
      {/* Screen Shape */}
      <meshStandardMaterial>
        <Html 
          transform 
          position={[0, 33.85, -13.12]}
          occlude="raycast"
          portal={portalRef}
        >
            <div
                style={{
                height: 590,
                width: 1210,
                background: "black",
                pointerEvents: isInFocus ? "all" : "none",
                }}
            >
                <Desktop />
          </div>
        </Html>
      </meshStandardMaterial>
    </mesh>
  );
};

export default MonitorScreen;
