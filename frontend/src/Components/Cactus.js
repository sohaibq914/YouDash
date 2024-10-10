
import "./Cactus.css";
import cactus0 from "./Cactus/Cactus0.png";
import cactus1 from "./Cactus/Cactus1.png";
import cactus2 from "./Cactus/Cactus2.png";
import cactus3 from "./Cactus/Cactus3.png";
import cactus4 from "./Cactus/Cactus4.png";
import cactus5 from "./Cactus/Cactus5.png";
import cactus6 from "./Cactus/Cactus6.png";
import cactus7 from "./Cactus/Cactus7.png";
import cactus8 from "./Cactus/Cactus8.png";
import cactus9 from "./Cactus/Cactus9.png";
import cactus10 from "./Cactus/Cactus10.png";
import cactusDroop from "./Cactus/CactusDroop.png";


function Cactus(props) {
    const goal = props.goal;
    const progress = goal.goalProgress;
  return (
    <div className="Cactus" style={{width: "100%", alignItems: "center"}}>

        {(progress < 0.1) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus0} />
        </>): (<>
        {(progress < 0.2) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus1} />

        </>): (<>
        {(progress < 0.3) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus2} />

        </>): (<>
        {(progress < 0.4) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus3} />

        </>): (<>
        {(progress < 0.5) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus4} />

        </>): (<>
        {(progress < 0.6) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus5} />

        </>): (<>
        {(progress < 0.7) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus6} />

        </>): (<>
        {(progress < 0.8) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus7} />

        </>): (<>
        {(progress < 0.9) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus8} />

        </>): (<>
        {(progress < 1) ? (<>
        <img style={{display: "block", margin: "auto"}} src={cactus9} />

        </>): (<>

        <img style={{display: "block", margin: "auto"}} src={cactus10} />
        </>)}
        </>)}
        </>)}
        </>)}
        </>)}
        </>)}
        </>)}
        </>)}
        </>)}
        </>)}
        <h3 style={{textAlign: "center"}}>Goal Progress: {progress*100}%</h3>
        </div>
    );
}

export default Cactus;