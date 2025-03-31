import { Vector3 } from "three";
import { useCameraView } from "../context/CameraContext";

interface DebugCameraControlsProps {
    debugMode: boolean;
    setDebugMode: (debug: boolean) => void;
}

const DebugCameraControls = ({ debugMode, setDebugMode }: DebugCameraControlsProps) => {
    const { cameraViews, cameraView, setCameraView } = useCameraView();

    return (
        <div className="p-2 absolute top-4 right-4 z-10 bg-white opacity-70 rounded">
            <div className="relative flex flex-col items-end">
                <button className="px-2 py-1 bg-white hover:bg-blue-400 rounded" onClick={() => setDebugMode(!debugMode)} >
                    {debugMode ? "Hide Debug UI" : "Show Debug UI"}
                </button>
        
                {/* Render Debug Controls Only When Debug Mode is Enabled */}
                {debugMode && <div className="mt-2 flex flex-col items-end">
                    <button 
                        className={`px-2 py-1 mb-2 rounded hover:bg-blue-400 ${cameraView === cameraViews.main ? "bg-blue-300" : "bg-white"}`} 
                        onClick={() => setCameraView(cameraViews.main)}
                    >
                        Main View
                    </button>
                    <button 
                        className={`px-2 py-1 mb-2 rounded hover:bg-blue-400 ${cameraView === cameraViews.monitor ? "bg-blue-300" : "bg-white"}`} 
                        onClick={() => setCameraView(cameraViews.monitor)}
                    >
                        Monitor View
                    </button>
                    <button 
                        className={`px-2 py-1 mb-2 rounded hover:bg-blue-400 ${cameraView === cameraViews.speaker ? "bg-blue-300" : "bg-white"}`} 
                        onClick={() => setCameraView(cameraViews.speaker)}
                    >
                        Speaker View
                    </button>
                    
                    <div className="flex flex-col items-end p-2">
                        <h3 className="font-bold">Current Camera Position</h3>
                        <div className="mb-2"> 
                            <div>{`${cameraView.position.x}, ${cameraView.position.y}, ${cameraView.position.z}`}</div>
                        </div>

                        {["x", "y", "z"].map((axis) => (
                            <div key={`position-${axis}`} style={{ marginBottom: "5px" }}>
                                <label>
                                    {axis.toUpperCase()}:{" "}
                                    <input
                                        type="range"
                                        min="-100"
                                        max="100"
                                        step="0.1"
                                        value={cameraView.position[axis as keyof Vector3] as number}
                                        onChange={(e) => {
                                                const newView = {
                                                    ...cameraView,
                                                    position: new Vector3(
                                                        axis === "x" ? parseFloat(e.target.value) : cameraView.position.x,
                                                        axis === "y" ? parseFloat(e.target.value) : cameraView.position.y,
                                                        axis === "z" ? parseFloat(e.target.value) : cameraView.position.z
                                                    ),
                                                }
                                                setCameraView(newView);
                                            }                                          
                                        }
                                    />
                                </label>
                            </div>
                        ))};
                        

                        <h3 className="font-bold">Current LookAt Position</h3>
                        <div className="mb-2"> 
                            <div>{`${cameraView.lookAt.x}, ${cameraView.lookAt.y}, ${cameraView.lookAt.z}`}</div>
                        </div>

                        {["x", "y", "z"].map((axis) => (
                            <div key={`position-${axis}`} style={{ marginBottom: "5px" }}>
                                <label>
                                    {axis.toUpperCase()}:{" "}
                                    <input
                                        type="range"
                                        min="-100"
                                        max="100"
                                        step="0.1"
                                        value={cameraView.lookAt[axis as keyof Vector3] as number}
                                        onChange={(e) => {
                                            const newView = {
                                                ...cameraView,
                                                lookAt: new Vector3(
                                                    axis === "x" ? parseFloat(e.target.value) : cameraView.lookAt.x,
                                                    axis === "y" ? parseFloat(e.target.value) : cameraView.lookAt.y,
                                                    axis === "z" ? parseFloat(e.target.value) : cameraView.lookAt.z
                                                ),
                                            }
                                            setCameraView(newView);
                                        }                                          
                                    }
                                    />
                                </label>
                            </div>
                        ))};
                    </div>                   
                </div>}
            </div>  
        </div>            
    );
};

export default DebugCameraControls;
