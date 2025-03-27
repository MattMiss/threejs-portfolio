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
    <div className="absolute top-4 right-4 z-10">
            <div className="relative flex flex-col items-end">
              <button className="px-2 py-1 mb-2 bg-white hover:bg-blue-400 rounded" onClick={() => setDebugMode(!debugMode)} >
                {debugMode ? "Hide Debug UI" : "Show Debug UI"}
              </button>
    
              {/* Render Debug Controls Only When Debug Mode is Enabled */}
              {debugMode && <div>
                    <button 
                        className={`px-2 py-1 mb-2 rounded hover:bg-blue-400 ${currentCameraView === cameraViews.main ? "bg-blue-300" : "bg-white"}`} 
                        onClick={() => setCurrentCameraView(cameraViews.main)}
                    >
                        Main View
                    </button>
                    <button 
                        className={`px-2 py-1 mb-2 mx-2 rounded hover:bg-blue-400 ${currentCameraView === cameraViews.monitor ? "bg-blue-300" : "bg-white"}`} 
                        onClick={() => setCurrentCameraView(cameraViews.monitor)}
                    >
                        Monitor View
                    </button>
                    <button 
                        className={`px-2 py-1 mb-2 rounded hover:bg-blue-400 ${currentCameraView === cameraViews.speaker ? "bg-blue-300" : "bg-white"}`} 
                        onClick={() => setCurrentCameraView(cameraViews.speaker)}
                    >
                        Speaker View
                    </button>
                    
                    <div className="flex flex-col items-end p-2">
                        <h3 className="font-bold">Current Camera Position</h3>
                        <div className="mb-2"> 
                            <div>{`${currentCameraView.position.x}, ${currentCameraView.position.y}, ${currentCameraView.position.z}`}</div>
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
                        ))};
                        

                        <h3 className="font-bold">Current LookAt Position</h3>
                        <div className="mb-2"> 
                            <div>{`${currentCameraView.lookAt.x}, ${currentCameraView.lookAt.y}, ${currentCameraView.lookAt.z}`}</div>
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
                        ))};
                    </div>                   
                </div>}
            </div>  
          </div>
    
  );
};

export default DebugCameraControls;
