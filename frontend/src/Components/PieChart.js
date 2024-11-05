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
        //getData();
    }, [props.timeFrame, props.timeFrameSelection, timeFrame, timeFrameSelection]);

    useEffect (() => {
        //getData();
    }, []);

    const getData = () => {
        console.log("getting pie data");
            axios
                .get("http://localhost:8080/goals/" + props.userId + "/" + timeFrame + "/" + timeFrameSelection + "/pie")
                .then(function (response) {

                //console.log(timeFrame, timeFrameSelection);
                console.log(response.data, props.userId, timeFrameSelection, timeFrame, props.timeFrame, props.timeFrameSelection);
                    if ("" + response.data == "NaN") {
                        setTimeout(function() {
                        console.log("timeout)");
                        getData();
                        }, 500);
                    }
                    if (response.data > 1) {
                        setPercent(1);
                    } else {
                        setPercent(response.data);
                    }
                })
                .catch((error) => console.error(error));
    }


    const data = {
                       labels: ["Progress", "To Go"],
                       datasets: [
                         {
                           data: [100*props.percentVal, 100*(1 - props.percentVal)],
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
    {(props.percentVal >= 1) ? (
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