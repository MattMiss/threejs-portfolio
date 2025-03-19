import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface LineCurveProps {
    showLine: boolean;
    startPoint: number[] 
    endPoint: number[]   
}


const LineCurve = ({showLine, startPoint, endPoint} : LineCurveProps) => {
  const start = new THREE.Vector3(startPoint[0], startPoint[1], startPoint[2]);
  const end = new THREE.Vector3(endPoint[0], endPoint[1], endPoint[2]);

  return (
    <>
      {showLine && (
          <Line
              points={[start, end]}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
              color="white"                   // Default
              lineWidth={1}                   // In pixels (default)
              segments                        // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
              dashed={false}                  // Default
              vertexColors={[[255, 255, 255], [255, 255, 255]]} // Optional array of RGB values for each point
            />
      )}
    </>
  );
};

export default LineCurve;