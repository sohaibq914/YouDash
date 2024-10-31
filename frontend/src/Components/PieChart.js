import React, { useEffect, useState } from "react";
import axios from "axios";
import chart from "chart.js";

import Confetti from 'react-confetti';

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import "./PieChart.css";
ChartJS.register(ArcElement, Tooltip, Legend);
function PieChart(props) {
    const timeFrame = props.timeFrame;
    const timeFrameSelection = props.timeFrameSelection;

    const [percent, setPercent] = useState(0);
    const width = window.innerWidth;
    const height = window.innerHeight;

    useEffect(() => {
        getData();
    }, [props.timeFrame, props.timeFrameSelection]);

    useEffect (() => {
        getData();
    }, []);

    const getData = () => {
            axios
                .get("http://localhost:8080/goals/" + getUser() + "/" + timeFrame + "/" + timeFrameSelection + "/pie")
                .then(function (response) {

                console.log(timeFrame, timeFrameSelection);
                    if (response.data > 1) {
                        setPercent(1);
                    } else {
                        setPercent(response.data);
                    }
                })
                .catch((error) => console.error(error));
    }

    const getUser = () => {
                let theUrl = window.location.href;
                console.log(theUrl);
                if (theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1) == -1) {
                    return null;
                }
                console.log(theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1)));
                return theUrl.substring(theUrl.indexOf("/", 10) + 1, theUrl.indexOf("/", theUrl.indexOf("/", 10) + 1));

            }

    const data = {
                       labels: ["Progress", "To Go"],
                       datasets: [
                         {
                           data: [100*percent, 100*(1 - percent)],
                           backgroundColor: [
                             'rgba(255, 99, 132, 0.8)',
                             'rgba(54, 162, 235, 0.8)'
                           ],
                           borderWidth: 1,
                         },
                       ],
                     };

    return (
    <div className="PieChart">
    {(percent >= 1) ? (
    <>
        <Confetti width={width} height={height} />
    </>
    ) : (
    <>
    </>
    )}
        <Pie id={"pie " + percent} data={data} style={{width: "100%"}}/>
    </div>
    );

}

export default PieChart;