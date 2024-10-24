import React, { useEffect, useState } from "react";
import axios from "axios";
import "./YouDashBoard.css";
import PieChart from "../Components/PieChart";

function YouDashBoard() {

  const [statusRow1, changeStatus1] = useState(0);

  const fullLeft1  = (e) => {
    changeStatus1(1);
    console.log("resize");
  }

  const fullRight1  = (e) => {
    changeStatus1(2);
  }

  const split1 = (e) => {
    changeStatus1(0);
  }

  const [statusRow2, changeStatus2] = useState(0);

    const fullLeft2  = (e) => {
      changeStatus2(1);
    }

    const fullRight2  = (e) => {
      changeStatus2(2);
    }

    const split2 = (e) => {
      changeStatus2(0);
    }

  return (
    <div className="YouDashBoard">
        <h3 className="titleDash"> YouDashBoard </h3>
        <table>
            <tbody>
                {(statusRow1 == 0) ? (
                <>
                <tr>
                    <td>
                        <button type="button" style={{ width: "100%", padding: "0%" }} id="r1left" onClick={fullLeft1}>Expand</button>
                        <div className="halfPie">
                            <PieChart />
                        </div>
                    </td>
                    <td>
                        <button type="button" style={{ width: "100%", padding: "0%" }} id="r1right" onClick={fullRight1}>Expand</button>
                        <p> Placeholder 2</p>
                    </td>
                </tr>
                </>
                ) : ( <>
                {(statusRow1 == 1) ? (<>
                <tr>
                    <td colSpan="2">
                        <button type="button" style={{ width: "100%", padding: "0%" }} id="r1left" onClick={split1}>Split</button>
                        <div className="fullPie">
                            <PieChart />
                        </div>
                    </td>
                </tr>

                </>) : ( <>

                <tr>
                    <td colSpan="2">
                        <button type="button" style={{ width: "100%", padding: "0%" }} id="r1right" onClick={split1}>Split</button>
                        <p> Placeholder 2</p>
                    </td>
                </tr>

                </>)}
                </>)}


                {(statusRow2 == 0) ? (
                        <>
                        <tr>
                            <td>
                                <button type="button" style={{ width: "100%", padding: "0%" }} id="r2left" onClick={fullLeft2}>Expand</button>
                                <p> Coming Soon!</p>
                            </td>
                            <td>
                                <button type="button" style={{ width: "100%", padding: "0%" }} id="r2right" onClick={fullRight2}>Expand</button>
                                <p> Coming Soon!</p>
                            </td>
                        </tr>
                        </>
                        ) : ( <>
                        {(statusRow2 == 1) ? (<>
                        <tr>
                            <td colSpan="2">
                                <button type="button" style={{ width: "100%", padding: "0%" }} id="r2left" onClick={split2}>Split</button>
                                <p> Coming Soon!</p>
                            </td>
                        </tr>

                        </>) : ( <>

                        <tr>
                            <td colSpan="2">
                                <button type="button" style={{ width: "100%", padding: "0%" }} id="r2right" onClick={split2}>Split</button>
                                <p> Coming Soon!</p>
                            </td>
                        </tr>

                        </>)}
                        </>)}
            </tbody>
        </table>
    </div>
  );
}

export default YouDashBoard;
