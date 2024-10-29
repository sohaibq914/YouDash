import React, { useEffect, useState } from "react";
import axios from "axios";
import "./YouDashBoard.css";
import PieChart from "../Components/PieChart";

function YouDashBoard() {

  const [statusRow1, changeStatus1] = useState(0);

  const [timeFrame, changeTimeFrame] = useState(0);
  const [timeFrameSelection, changeTimeFrameSelection] = useState(1);

  const fullLeft1  = (e) => {
    changeStatus1(1);
    console.log("resize");
  }

  const fullRight1  = (e) => {
    changeStatus1(2);
    if (timeFrame == 0) {
        selDay1();
    }
    if (timeFrame == 1) {
        selWeek1();
    }
    if (timeFrame == 2) {
        selMonth1();
    }
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

    useEffect(() => {
        if (timeFrame == 0) {
            selDay1();
        }
        if (timeFrame == 1) {
            selWeek1();
        }
        if (timeFrame == 2) {
            selMonth1();
        }
        sel(timeFrameSelection);
    }, [statusRow1]);

    const selDay1 = (e) => {
        changeTimeFrame(0);
        if (document.getElementById("r1week").classList.contains("timeFrameBtnSel")) {
            document.getElementById("r1week").classList.remove("timeFrameBtnSel");
        }
        if (document.getElementById("r1month").classList.contains("timeFrameBtnSel")) {
            document.getElementById("r1month").classList.remove("timeFrameBtnSel");
        }
        document.getElementById("r1day").classList.add("timeFrameBtnSel");
    }
    const selWeek1 = (e) => {
        changeTimeFrame(1);
        if (document.getElementById("r1month").classList.contains("timeFrameBtnSel")) {
            document.getElementById("r1month").classList.remove("timeFrameBtnSel");
        }
        if (document.getElementById("r1day").classList.contains("timeFrameBtnSel")) {
            document.getElementById("r1day").classList.remove("timeFrameBtnSel");
        }
        document.getElementById("r1week").classList.add("timeFrameBtnSel");
    }
    const selMonth1 = (e) => {
        changeTimeFrame(2);
        if (document.getElementById("r1week").classList.contains("timeFrameBtnSel")) {
            document.getElementById("r1week").classList.remove("timeFrameBtnSel");
        }
        if (document.getElementById("r1day").classList.contains("timeFrameBtnSel")) {
            document.getElementById("r1day").classList.remove("timeFrameBtnSel");
        }
        document.getElementById("r1month").classList.add("timeFrameBtnSel");
    }
    const sel = (e) => {
        changeTimeFrameSelection(e);
        for (var i = 1; i <= 7; i++) {
            if (i == e) {
                continue;
            }
            if (document.getElementById("r1" + i).classList.contains("timeFrameBtnSel")) {
                document.getElementById("r1" + i).classList.remove("timeFrameBtnSel");
            }
        }
        document.getElementById("r1" + e).classList.add("timeFrameBtnSel");

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
                        <div className="timeFrame">
                            <br/>
                            <br/>
                            <button type="button" style={{ width: "80%" }} id="r1day" onClick={selDay1}>Day</button>
                            <br/>
                            <button type="button" style={{ width: "80%" }} id="r1week" onClick={selWeek1}>Week</button>
                            <br/>
                            <button type="button" style={{ width: "80%" }} id="r1month" onClick={selMonth1}>Month</button>
                            <br/>
                        </div>
                        <div className="timeFrameSelection">
                            <br/>
                            <br/>
                            <button type="button" style={{ width: "10%" }} id="r11" onClick={() => sel(1)}>1</button>
                            <button type="button" style={{ width: "10%" }} id="r12" onClick={() => sel(2)}>2</button>
                            <button type="button" style={{ width: "10%" }} id="r13" onClick={() => sel(3)}>3</button>
                            <button type="button" style={{ width: "10%" }} id="r14" onClick={() => sel(4)}>4</button>
                            <button type="button" style={{ width: "10%" }} id="r15" onClick={() => sel(5)}>5</button>
                            <button type="button" style={{ width: "10%" }} id="r16" onClick={() => sel(6)}>6</button>
                            <button type="button" style={{ width: "10%" }} id="r17" onClick={() => sel(7)}>7</button>
                            <br/>
                        </div>
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
                        <div className="timeFrame">
                            <br/>
                            <br/>
                            <button type="button" style={{ width: "80%" }} id="r1day" onClick={selDay1}>Day</button>
                            <br/>
                            <button type="button" style={{ width: "80%" }} id="r1week" onClick={selWeek1}>Week</button>
                            <br/>
                            <button type="button" style={{ width: "80%" }} id="r1month" onClick={selMonth1}>Month</button>
                            <br/>
                        </div>
                        <div className="timeFrameSelection">
                            <br/>
                            <br/>
                            <button type="button" style={{ width: "10%" }} id="r11" onClick={() => sel(1)}>1</button>
                            <button type="button" style={{ width: "10%" }} id="r12" onClick={() => sel(2)}>2</button>
                            <button type="button" style={{ width: "10%" }} id="r13" onClick={() => sel(3)}>3</button>
                            <button type="button" style={{ width: "10%" }} id="r14" onClick={() => sel(4)}>4</button>
                            <button type="button" style={{ width: "10%" }} id="r15" onClick={() => sel(5)}>5</button>
                            <button type="button" style={{ width: "10%" }} id="r16" onClick={() => sel(6)}>6</button>
                            <button type="button" style={{ width: "10%" }} id="r17" onClick={() => sel(7)}>7</button>
                            <br/>
                        </div>
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
