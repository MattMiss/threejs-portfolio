import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";


//const screenPosition: [number, number, number] = [0, 3.385, -1.3];
const screenPosition: [number, number, number] = [0, 6.7, -2.6];

const PortfolioScreen = () => {
  const { camera } = useThree();
  const [scaleFactor, setScaleFactor] = useState(0.2);

      // Dynamically adjust scale to keep text sharp
    useFrame(() => {
      const distance = camera.position.distanceTo({ x: screenPosition[0], y: screenPosition[1], z: screenPosition[2] });
      setScaleFactor(0.2 * (distance / 5)); // Adjust scale dynamically based on camera distance
    });

    const handleHashNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();


      console.log("Clicked");
    };
  
    return (
      <group>
          <Html transform position={screenPosition} scale={scaleFactor}>
            <div id="portfolio-container" 
              style={{
                pointerEvents: "all",
                width: 1100,
                height: 540,
                overflow: "hidden",
                color: "white",
                border: "1px solid",
                borderColor: "white",
                fontSize: 40,
                background: "rgba(0, 0, 0, 0.8)", // Reduce transparency to prevent contrast issues
                filter: "contrast(1.2) brightness(1.1)", // Enhances clarity

  textRendering: "optimizeLegibility",
              }}
              >
              <h1>Welcome to My Portfolio</h1>
              <p>This is now fully interactive inside the 3D scene!</p>
              <a onClick={handleHashNavigation}>Go to Projects</a>
              <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ipsum turpis, consectetur sit amet rhoncus vel, tincidunt at nibh. Quisque ac faucibus metus. Nunc ac diam enim. Duis et nisl dui. Donec tempus nibh id purus tempus, vel congue dolor eleifend. Sed nibh elit, euismod in lorem nec, dictum lacinia leo. Phasellus eu imperdiet massa. Praesent aliquet tempor nisi sit amet facilisis. In facilisis, diam quis imperdiet ornare, orci lectus cursus sapien, vitae tristique mi est ut est. Nulla sit amet odio aliquam ex vehicula molestie. Aenean non commodo ex. Quisque sit amet nulla eu sem bibendum finibus non at purus.</p>
        
              <div id="projects" style={{ paddingTop: "20px", borderTop: "1px solid white" }}>
                <h2>Projects</h2>
                <p>Here are some of my projects...</p>
              </div>
            </div>
          </Html>
      </group>
      
      
    );
  };
  
  export default PortfolioScreen;
  