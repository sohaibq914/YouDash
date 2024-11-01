import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./YouDashBoard.css";
import PieChart from "../Components/PieChart";

import WatchTimeChart from "../Components/WatchDataChartCustom.jsx";

import GoalBarCustom from "../Components/BarChartGoals";

function YouDashBoard() {
  const [userId, setUserId] = useState(0);
  const [userData, setUserData] = useState(null);
  const [statusRow1, changeStatus1] = useState(0);
  let changeableFrame = true;

  const [timeFrame, changeTimeFrame] = useState(0);
  const [timeFrameSelection, changeTimeFrameSelection] = useState(1);
  const [statusRow2, changeStatus2] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [percentVal, setPercentVal] = useState(0);

    useEffect(() => {
        const weekElement = document.getElementById("r1week");
          const dayElement = document.getElementById("r1day");
          const monthElement = document.getElementById("r1month");
          if (!weekElement || !monthElement || !dayElement) {
            //console.error("One or more elements not found");
            return;
          }
          if (statusRow1 != 1) {
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
          }
          if (changeableFrame) {
            axios
                .get("http://localhost:8080/goals/" + getUser() + "/" + timeFrame + "/" + (timeFrameSelection-1))
                .then(function (response) {
                console.log("uploaded");
                console.log(timeFrame, timeFrameSelection);
                calcPie(timeFrame, timeFrameSelection, true);
                console.log(response.data);
                })
                .catch((error) => console.error(error));
            }
    }, [timeFrame, timeFrameSelection]);

  useEffect(() => {
    const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/' + getUser());
      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
      setLoading(false);
    }
    };
    fetchUserData();
  }, []);

    useEffect(() => {
        if (userData != null && changeableFrame) {
              console.log(userData, userData.timeFrame, userData.timeFrameSelection);
              changeTimeFrame(userData.timeFrame);
              changeTimeFrameSelection((userData.timeFrameSelection+1));
              console.log(timeFrame, timeFrameSelection);
              const weekElement = document.getElementById("r1week");
              const dayElement = document.getElementById("r1day");
              const monthElement = document.getElementById("r1month");
              if (!weekElement || !monthElement || !dayElement) {
                //console.error("One or more elements not found");
                return;
              }
              if (statusRow1 != 1) {
                  if (userData.timeFrame == 0) {
                      selDay1();
                  }
                  if (userData.timeFrame == 1) {
                      selWeek1();
                  }
                  if (userData.timeFrame == 2) {
                      selMonth1();
                  }
                  sel(userData.timeFrameSelection+1);
              }
            calcPie(userData.timeFrame, userData.timeFrameSelection, true);
        } else {
            changeTimeFrame(0);
              changeTimeFrameSelection(1);
              const weekElement = document.getElementById("r1week");
              const dayElement = document.getElementById("r1day");
              const monthElement = document.getElementById("r1month");
              if (!weekElement || !monthElement || !dayElement) {
                //console.error("One or more elements not found");
                return;
              }
              selWeek1();
              sel(1);
            calcPie(1, 1, true);
        }
    }, [userData]);



    const getUser = () => {
            let theUrl = window.location.href;
            //console.log(theUrl);
            if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
                return null;
            }
            if (theUrl.indexOf("/", theUrl.length-7) != -1) {
                //console.log(theUrl.substring(theUrl.indexOf("/", theUrl.length-7) + 1, theUrl.length));
                changeableFrame = false;
                return theUrl.substring(theUrl.indexOf("/", theUrl.length-7) + 1, theUrl.length);
            }
            //console.log(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
            changeableFrame = true;
            return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));

        }

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
        const weekElement = document.getElementById("r1week");
        const dayElement = document.getElementById("r1day");
        const monthElement = document.getElementById("r1month");
        if (!weekElement || !monthElement || !dayElement) {
          //console.error("One or more elements not found");
          return;
        }
        if (statusRow1 != 1) {
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
        }
        calcPie(timeFrame, timeFrameSelection, true);
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

    const calcPie = (theTimeFrame, theTimeFrameSelection, retry) => {
        console.log("CALC pie data");
            axios
                .get("http://localhost:8080/goals/" + getUser() + "/" + theTimeFrame + "/" + theTimeFrameSelection + "/pie")
                .then(function (response) {

                console.log(response.data, theTimeFrame, theTimeFrameSelection, getUser());
                //console.log(response.data, props.userId, timeFrameSelection, timeFrame, props.timeFrame, props.timeFrameSelection);
                    /*if ("" + response.data == "NaN") {
                        setTimeout(function() {
                        console.log("timeout)");
                        calcPie(timeFrame, timeFrameSelection, true);
                        }, 500);
                        return;
                    }
                    if (retry) {
                        setTimeout(function() {
                        console.log("retry");
                        calcPie(timeFrame, timeFrameSelection, false);
                        }, 1000);
                        return;
                    }*/
                    if (response.data > 1) {
                        setPercentVal(1);
                    } else {
                        setPercentVal(response.data);
                    }
                })
                .catch((error) => console.error(error));
    }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="YouDashBoard">
        <h3 className="titleDash"> {userData ? userData.name + "'s Dashboard" : 'YouDashBoard'} </h3>

        <table>
            <tbody>
                {(statusRow1 == 0) ? (
                <>
                <tr>
                    <td>
                        <button type="button" style={{ width: "100%", padding: "0%" }} id="r1left" onClick={fullLeft1}>Expand</button>
                        <div className="halfPie">
                            <PieChart timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={getUser()} percentVal={percentVal} />
                        </div>
                    </td>
                    <td>
                        <button type="button" style={{ width: "100%", padding: "0%" }} id="r1right" onClick={fullRight1}>Expand</button>
                        <div className="timeFrame">
                            <br/>
                            <br/>
                            <button type="button" style={{ width: "100%" }} id="r1day" onClick={selDay1}>Day</button>
                            <br/>
                            <button type="button" style={{ width: "100%" }} id="r1week" onClick={selWeek1}>Week</button>
                            <br/>
                            <button type="button" style={{ width: "100%" }} id="r1month" onClick={selMonth1}>Month</button>
                            <br/>
                        </div>
                            <br/>
                            <br/>
                        <p style={{color: "white"}}>Units of time in the past:</p>
                        <div className="timeFrameSelection">
                            <button type="button" style={{ width: "14%" }} id="r11" onClick={() => sel(1)}>1</button>
                            <button type="button" style={{ width: "14%" }} id="r12" onClick={() => sel(2)}>2</button>
                            <button type="button" style={{ width: "14%" }} id="r13" onClick={() => sel(3)}>3</button>
                            <button type="button" style={{ width: "14%" }} id="r14" onClick={() => sel(4)}>4</button>
                            <button type="button" style={{ width: "14%" }} id="r15" onClick={() => sel(5)}>5</button>
                            <button type="button" style={{ width: "14%" }} id="r16" onClick={() => sel(6)}>6</button>
                            <button type="button" style={{ width: "14%" }} id="r17" onClick={() => sel(7)}>7</button>
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
                            <PieChart timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={getUser()} />
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
                            <button type="button" style={{ width: "100%" }} id="r1day" onClick={selDay1}>Day</button>
                            <br/>
                            <button type="button" style={{ width: "100%" }} id="r1week" onClick={selWeek1}>Week</button>
                            <br/>
                            <button type="button" style={{ width: "100%" }} id="r1month" onClick={selMonth1}>Month</button>
                            <br/>
                        </div>
                            <br/>
                            <br/>
                        <p style={{color: "white"}}>Units of time in the past:</p>
                        <div className="timeFrameSelection">
                            <button type="button" style={{ width: "14%" }} id="r11" onClick={() => sel(1)}>1</button>
                            <button type="button" style={{ width: "14%" }} id="r12" onClick={() => sel(2)}>2</button>
                            <button type="button" style={{ width: "14%" }} id="r13" onClick={() => sel(3)}>3</button>
                            <button type="button" style={{ width: "14%" }} id="r14" onClick={() => sel(4)}>4</button>
                            <button type="button" style={{ width: "14%" }} id="r15" onClick={() => sel(5)}>5</button>
                            <button type="button" style={{ width: "14%" }} id="r16" onClick={() => sel(6)}>6</button>
                            <button type="button" style={{ width: "14%" }} id="r17" onClick={() => sel(7)}>7</button>
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
                                <WatchTimeChart timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={getUser()} />
                            </td>
                            <td>
                                <button type="button" style={{ width: "100%", padding: "0%" }} id="r2right" onClick={fullRight2}>Expand</button>
                                <GoalBarCustom timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={getUser()} />
                            </td>
                        </tr>
                        </>
                        ) : ( <>
                        {(statusRow2 == 1) ? (<>
                        <tr>
                            <td colSpan="2">
                                <button type="button" style={{ width: "100%", padding: "0%" }} id="r2left" onClick={split2}>Split</button>
                                <WatchTimeChart timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={getUser()} />
                            </td>
                        </tr>

                        </>) : ( <>

                        <tr>
                            <td colSpan="2">
                                <button type="button" style={{ width: "100%", padding: "0%" }} id="r2right" onClick={split2}>Split</button>
                                <GoalBarCustom timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={getUser()} />
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