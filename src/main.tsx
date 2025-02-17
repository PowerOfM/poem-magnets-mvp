import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

console.log(`                                                          
                                                          
    _   __      ___      ___       __      ___    __  ___ 
  // ) )  ) ) //   ) ) //   ) ) //   ) ) //___) )  / /    
 // / /  / / //   / / ((___/ / //   / / //        / /     
// / /  / / ((___( (   //__   //   / / ((____    / /      
                                                          
                                                          
    ___      ___      ___      _   __            
  //   ) ) //   ) ) //___) ) // ) )  ) )         
 //___/ / //   / / //       // / /  / /   v0.0.1             
//       ((___/ / ((____   // / /  / /          
Coded by @powerofm`);

createRoot(document.getElementById("root")!).render(<App />);
