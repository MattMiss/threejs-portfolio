import { Vector3 } from "three";

interface DebugCameraControlsProps {
    debugMode: boolean;
    setDebugMode: (debug: boolean) => void;
    cameraViews: {
        main: { name: string, position: Vector3, lookAt: Vector3 },
        monitor: { name: string, position: Vector3, lookAt: Vector3 },
        speaker: { name: string, position: Vector3, lookAt: Vector3 }, 
    }
    currentCameraView: { name: string, position: Vector3; lookAt: Vector3 };
    setCurrentCameraView: React.Dispatch<
    React.SetStateAction<{ name: string, position: Vector3; lookAt: Vector3 }>
  >;
}

const DebugCameraControls = ({ debugMode, setDebugMode, cameraViews, currentCameraView, setCurrentCameraView }: DebugCameraControlsProps) => {
  return (
    <div style={{ position: "absolute", top: 20, left: 20 }}>
            <div style={{position: "relative"}}>
              <button onClick={() => setDebugMode(!debugMode)} >
                {debugMode ? "Hide Debug UI" : "Show Debug UI"}
              </button>
    
              {/* Render Debug Controls Only When Debug Mode is Enabled */}
              {debugMode && <div>
                    <button onClick={() => setCurrentCameraView(cameraViews.main)}>Main View</button>
                    <button onClick={() => setCurrentCameraView(cameraViews.monitor)}>Monitor View</button>
                    <button onClick={() => setCurrentCameraView(cameraViews.speaker)}>Speaker View</button>
                    
                    <h3>Current Camera Position</h3>

                    {["x", "y", "z"].map((axis) => (
                        <div key={`position-${axis}`} style={{ marginBottom: "5px" }}>
                            <label>
                                {axis.toUpperCase()}:{" "}
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="0.1"
                                    value={currentCameraView.position[axis as keyof Vector3] as number}
                                    onChange={(e) =>
                                    setCurrentCameraView((prevView) => ({
                                        ...prevView,
                                        position: new Vector3(
                                        axis === "x" ? parseFloat(e.target.value) : prevView.position.x,
                                        axis === "y" ? parseFloat(e.target.value) : prevView.position.y,
                                        axis === "z" ? parseFloat(e.target.value) : prevView.position.z
                                        ),
                                    }))
                                    }
                                />
                            </label>
                        </div>
                    ))}

                    <h3>Current LookAt Position</h3>
                    {["x", "y", "z"].map((axis) => (
                        <div key={`position-${axis}`} style={{ marginBottom: "5px" }}>
                            <label>
                                {axis.toUpperCase()}:{" "}
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    step="0.1"
                                    value={currentCameraView.lookAt[axis as keyof Vector3] as number}
                                    onChange={(e) =>
                                    setCurrentCameraView((prevView) => ({
                                        ...prevView,
                                        lookAt: new Vector3(
                                        axis === "x" ? parseFloat(e.target.value) : prevView.lookAt.x,
                                        axis === "y" ? parseFloat(e.target.value) : prevView.lookAt.y,
                                        axis === "z" ? parseFloat(e.target.value) : prevView.lookAt.z
                                        ),
                                    }))
                                    }
                                />
                            </label>
                        </div>
                    ))}

                    {/* Copy-Paste Debug Info */}
                    <h4>Current Values</h4>
                    <pre>
                        Position: {`Vector3(${currentCameraView.position.x}, ${currentCameraView.position.y}, ${currentCameraView.position.z})`}
                        <br />
                        LookAt: {`Vector3(${currentCameraView.lookAt.x}, ${currentCameraView.lookAt.y}, ${currentCameraView.lookAt.z})`}
                    </pre>
                </div>}
            </div>  
          </div>
    
  );
};

export default DebugCameraControls;
