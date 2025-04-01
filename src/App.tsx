import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei';
import DebugCameraControls from './components/DebugCameraControls';
import {  useState } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import DeskSceneNew from './components/DeskScene';
import CameraUpdater from './components/CameraUpdater';
import { CameraProvider } from './context/CameraProvider';
import { AudioProvider } from './context/AudioProvider';
import { InteractableProvider } from './context/InteractableProvider';
//import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";


const App = () => {
  const [debugMode, setDebugMode] = useState(false);
  //const [highlightedMesh, setHighlightedMesh] = useState<Mesh | null>(null);
  //const {songVolume: volume} = useAudio();

  return (
    <div id="canvas-container">
        <CameraProvider>
            <AudioProvider>
                <InteractableProvider>
                    <Stats showPanel={0}/>
                    <Canvas style={{ width: '100%', height: '100%' }}>
                        <CameraUpdater />
                        <ambientLight intensity={2} />
                        <OrbitControls enableZoom={debugMode} enablePan={debugMode} enableRotate={debugMode}/>
                            
                        <AudioPlayer 
                            songUrl='songs/6_16_24_WIP_2024-06-24.mp3' 
                            loop={true} 
                            fadeDuration={500}
                        />
                        
                        <DeskSceneNew />

                        {/* <Selection>
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
                        </Selection>         */}
                    </Canvas>

                    <DebugCameraControls 
                        debugMode={debugMode} 
                        setDebugMode={setDebugMode} 
                    />  
                

                    <div style={{ position: "absolute", bottom: 40, left: 20, color: "white", width: 1000 }}>
                        {/*Volume: {volume.toFixed(2)}
                        Position: {`${knobPos.x}, ${knobPos.y}, ${knobPos.z}`}

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
                </InteractableProvider>
            </AudioProvider>
        </CameraProvider>

        <div id="monitor-dom" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 2 }} onMouseOver={() => console.log("Hover")}/>    
    </div>
  )
}

export default App;