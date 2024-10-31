import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./YouDashBoard.css";
import PieChart from "../Components/PieChart";
import WatchTimeChart from "../Components/WatchDataChart.jsx";

function YouDashBoard() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [statusRow1, changeStatus1] = useState(0);
  const [timeFrame, changeTimeFrame] = useState(0);
  const [timeFrameSelection, changeTimeFrameSelection] = useState(1);
  const [statusRow2, changeStatus2] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
          setUserData(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle initial setup and time frame changes
  useEffect(() => {
    if (statusRow1 != 1) {
      const timer = setTimeout(() => {
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
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [statusRow1]);

  const fullLeft1 = (e) => {
    changeStatus1(1);
    console.log("resize");
  };

  const fullRight1 = (e) => {
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
  };

  const split1 = (e) => {
    changeStatus1(0);
  };

  const fullLeft2 = (e) => {
    changeStatus2(1);
  };

  const fullRight2 = (e) => {
    changeStatus2(2);
  };

  const split2 = (e) => {
    changeStatus2(0);
  };

  const selDay1 = (e) => {
    changeTimeFrame(0);
    const weekElement = document.getElementById("r1week");
    const monthElement = document.getElementById("r1month");
    const dayElement = document.getElementById("r1day");

    if (!weekElement || !monthElement || !dayElement) {
      console.error("One or more elements not found");
      return;
    }

    if (weekElement.classList.contains("timeFrameBtnSel")) {
      weekElement.classList.remove("timeFrameBtnSel");
    }
    if (monthElement.classList.contains("timeFrameBtnSel")) {
      monthElement.classList.remove("timeFrameBtnSel");
    }
    dayElement.classList.add("timeFrameBtnSel");
  };

  const selWeek1 = (e) => {
    changeTimeFrame(1);
    const monthElement = document.getElementById("r1month");
    const dayElement = document.getElementById("r1day");
    const weekElement = document.getElementById("r1week");

    if (!weekElement || !monthElement || !dayElement) {
      console.error("One or more elements not found");
      return;
    }

    if (monthElement.classList.contains("timeFrameBtnSel")) {
      monthElement.classList.remove("timeFrameBtnSel");
    }
    if (dayElement.classList.contains("timeFrameBtnSel")) {
      dayElement.classList.remove("timeFrameBtnSel");
    }
    weekElement.classList.add("timeFrameBtnSel");
  };

  const selMonth1 = (e) => {
    changeTimeFrame(2);
    const weekElement = document.getElementById("r1week");
    const dayElement = document.getElementById("r1day");
    const monthElement = document.getElementById("r1month");

    if (!weekElement || !monthElement || !dayElement) {
      console.error("One or more elements not found");
      return;
    }

    if (weekElement.classList.contains("timeFrameBtnSel")) {
      weekElement.classList.remove("timeFrameBtnSel");
    }
    if (dayElement.classList.contains("timeFrameBtnSel")) {
      dayElement.classList.remove("timeFrameBtnSel");
    }
    monthElement.classList.add("timeFrameBtnSel");
  };

  const sel = (e) => {
    changeTimeFrameSelection(e);
    for (var i = 1; i <= 7; i++) {
      if (i == e) {
        continue;
      }
      const element = document.getElementById("r1" + i);
      if (element && element.classList.contains("timeFrameBtnSel")) {
        element.classList.remove("timeFrameBtnSel");
      }
    }
    const selectedElement = document.getElementById("r1" + e);
    if (selectedElement) {
      selectedElement.classList.add("timeFrameBtnSel");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="YouDashBoard">
      <h3 className="titleDash">
        {userData ? `${userData.name}'s Dashboard` : 'YouDashBoard'}
      </h3>
      <table>
        <tbody>
          {statusRow1 == 0 ? (
            <>
              <tr>
                <td>
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r1left"
                    onClick={fullLeft1}
                  >
                    Expand
                  </button>
                  <div className="halfPie">
                    <PieChart timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={userId} />
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r1right"
                    onClick={fullRight1}
                  >
                    Expand
                  </button>
                  <div className="timeFrame">
                    <br />
                    <br />
                    <button
                      type="button"
                      style={{ width: "80%" }}
                      id="r1day"
                      onClick={selDay1}
                    >
                      Day
                    </button>
                    <br />
                    <button
                      type="button"
                      style={{ width: "80%" }}
                      id="r1week"
                      onClick={selWeek1}
                    >
                      Week
                    </button>
                    <br />
                    <button
                      type="button"
                      style={{ width: "80%" }}
                      id="r1month"
                      onClick={selMonth1}
                    >
                      Month
                    </button>
                    <br />
                  </div>
                  <div className="timeFrameSelection">
                    <br />
                    <br />
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        style={{ width: "10%" }}
                        id={`r1${num}`}
                        onClick={() => sel(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <br />
                  </div>
                </td>
              </tr>
            </>
          ) : statusRow1 == 1 ? (
            <>
              <tr>
                <td colSpan="2">
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r1left"
                    onClick={split1}
                  >
                    Split
                  </button>
                  <div className="fullPie">
                    <PieChart timeFrame={timeFrame} timeFrameSelection={timeFrameSelection} userId={userId} />
                  </div>
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <td colSpan="2">
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r1right"
                    onClick={split1}
                  >
                    Split
                  </button>
                  <div className="timeFrame">
                    <br />
                    <br />
                    <button
                      type="button"
                      style={{ width: "80%" }}
                      id="r1day"
                      onClick={selDay1}
                    >
                      Day
                    </button>
                    <br />
                    <button
                      type="button"
                      style={{ width: "80%" }}
                      id="r1week"
                      onClick={selWeek1}
                    >
                      Week
                    </button>
                    <br />
                    <button
                      type="button"
                      style={{ width: "80%" }}
                      id="r1month"
                      onClick={selMonth1}
                    >
                      Month
                    </button>
                    <br />
                  </div>
                  <div className="timeFrameSelection">
                    <br />
                    <br />
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        style={{ width: "10%" }}
                        id={`r1${num}`}
                        onClick={() => sel(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <br />
                  </div>
                </td>
              </tr>
            </>
          )}

          {statusRow2 == 0 ? (
            <>
              <tr>
                <td>
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r2left"
                    onClick={fullLeft2}
                  >
                    Expand
                  </button>
                  <WatchTimeChart userId={userId} />
                </td>
                <td>
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r2right"
                    onClick={fullRight2}
                  >
                    Expand
                  </button>
                  <p> More Analytics Coming Soon!</p>
                </td>
              </tr>
            </>
          ) : statusRow2 == 1 ? (
            <>
              <tr>
                <td colSpan="2">
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r2left"
                    onClick={split2}
                  >
                    Split
                  </button>
                  <WatchTimeChart userId={userId} />
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <td colSpan="2">
                  <button
                    type="button"
                    style={{ width: "100%", padding: "0%" }}
                    id="r2right"
                    onClick={split2}
                  >
                    Split
                  </button>
                  <p> More Analytics Coming Soon!</p>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default YouDashBoard;