import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei';
import { Mesh } from 'three';
import DeskScene from './components/DeskScene';
import CameraController from './components/CameraController';
import DebugCameraControls from './components/DebugCameraControls';
import { Vector3 } from "three";
import { useState } from 'react';
import MonitorScreen from './components/MonitorScreen';
import TooltipLine from './components/TooltipLine';
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import VolumeKnob from './components/VolumeKnob';
import SpeakerSwitch from './components/SpeakerSwitch';
import { AudioPlayer } from './components/AudioPlayer';


// Define preset camera positions and their corresponding lookAt targets
const cameraViews = {
  main: { name: "Desk", position: new Vector3(-19, 51, 45), lookAt: new Vector3(0, 8.5, -27) },
  monitor: { name: "Monitor", position: new Vector3(0, 33, 1), lookAt: new Vector3(0, 33, -20) },
  speaker: { name: "Speakers_1", position: new Vector3(-21, 25, 9), lookAt: new Vector3(-29, 24, -14) }, 
};

const objectLines = {
  speaker: { startPoint: [-27, 30, -5], endPoint: [-27, 40, -5]},
  monitor: { startPoint: [0, 42, -13], endPoint: [0, 48, -13]},
}


const App = () => {
  const [currentCameraView, setCurrentCameraView] = useState(cameraViews.main);
  const [debugMode, setDebugMode] = useState(false);
  const [highlightedMesh, setHighlightedMesh] = useState<Mesh | null>(null);

  const [speakersOn, setSpeakersOn] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isVolumeChanging, setIsVolumeChanging] = useState(false);

  //const [knobPos, setKnobPos] = useState<Vector3>(new Vector3(-26.53, 22.25, -0.59));

  const onMeshClick = (meshName : string) => {
    if (isVolumeChanging) return;
    switch (meshName){
      case "Monitor":
        if (currentCameraView === cameraViews.monitor) return;
        setCurrentCameraView(cameraViews.monitor);
        break;
      case "Speakers_1":
        if (currentCameraView === cameraViews.speaker) return;
        setCurrentCameraView(cameraViews.speaker);
        break;
      case "Desk":
        if (currentCameraView === cameraViews.main) return;
          setCurrentCameraView(cameraViews.main);
          break;
    }
  }

  return (
    <div id="canvas-container">
      <Stats showPanel={0}/>
      <Canvas 
        style={{ width: '100vw', height: '100vh', position: 'relative' }} 
      >
        <CameraController targetPosition={currentCameraView.position} targetLookAt={currentCameraView.lookAt}/>
        <ambientLight intensity={2} />
        <OrbitControls enableZoom={debugMode} enablePan={debugMode} enableRotate={debugMode}/>
           
        <AudioPlayer 
          songUrl='songs/6_16_24_WIP_2024-06-24.mp3' 
          loop={true} 
          initialVolume={0.5} 
          volume={volume}
          playing={speakersOn}
          fadeDuration={500}
        />
        <MonitorScreen 
          isInFocus={currentCameraView === cameraViews.monitor}
        />
        <TooltipLine 
          show={!isVolumeChanging && highlightedMesh?.name === "Speakers_1"} 
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

        <VolumeKnob 
          canInteract={currentCameraView === cameraViews.speaker}
          minValue={0} 
          maxValue={1} 
          onChange={setVolume} 
          onInteracting={setIsVolumeChanging}
          position={[ -26.52, 22.25, -0.61]}
          rotation={[0, Math.PI * 0.16, 0]}
        />

        <SpeakerSwitch 
          canInteract={currentCameraView === cameraViews.speaker}
          speakersOn={speakersOn}
          onSwitch={setSpeakersOn}
          position={[-23.35, 22.25, -2.5]}
          rotation={[0, Math.PI * 0.16, 0]}
        />

        <Selection>
          <DeskScene 
            speakersOn={speakersOn}
            canHover={!isVolumeChanging}
            onMeshClick={onMeshClick} 
            currentView={currentCameraView.name}
            setHighlightedMesh={setHighlightedMesh}
          />

          <EffectComposer multisampling={2} autoClear={false}>
            <Outline
                blur
                xRay={true}
                pulseSpeed={0.3}
                kernelSize={0}
                hiddenEdgeColor={0}
                edgeStrength={10}
                width={2000}
            />
          </EffectComposer>
        </Selection>        
      </Canvas>

      <DebugCameraControls 
        debugMode={debugMode} 
        setDebugMode={setDebugMode} 
        cameraViews={cameraViews}
        currentCameraView={currentCameraView} 
        setCurrentCameraView={setCurrentCameraView} 
      />  

      <div style={{ position: "absolute", bottom: 40, left: 20, color: "white", width: 1000 }}>
        Volume: {volume.toFixed(2)}
        {/* Position: {`${knobPos.x}, ${knobPos.y}, ${knobPos.z}`}

        {["x", "y", "z"].map((axis) => (
          <div key={`position-${axis}`} style={{ marginBottom: "5px", width: '100%' }}>
            <label>
              {axis.toUpperCase()}:{" "}
              <input
                style={{width: "100%"}}
                type="range"
                min="-30"
                max="30"
                step="0.01"
                value={knobPos[axis as keyof THREE.Vector3]} // Get correct value
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  setKnobPos((prevPos) => prevPos.clone().set(
                    axis === "x" ? newValue : prevPos.x,
                    axis === "y" ? newValue : prevPos.y,
                    axis === "z" ? newValue : prevPos.z
                  )); // Correctly return a new Vector3
                }}
              />
            </label>
          </div>
        ))} */}
      </div>

      <div id="monitor-dom" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 2 }} />
    </div>
  )
}

export default App;