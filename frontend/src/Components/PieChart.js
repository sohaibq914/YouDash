import React, { useEffect, useState } from "react";
import axios from "axios";
import chart from "chart.js";

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import "./PieChart.css";
ChartJS.register(ArcElement, Tooltip, Legend);
function PieChart() {

    const data = {
                       labels: ["Watch", "Avoid"],
                       datasets: [
                         {
                           data: [12.4, 77.8],
                           backgroundColor: [
                             'rgba(255, 99, 132, 0.8)',
                             'rgba(54, 162, 235, 0.8)'
                           ],
                           borderWidth: 1,
                         },
                       ],
                     };

    useEffect (() => {
        console.log("Load data here");
        //change colors depending on aim above or below
        //update percentages
    }, []);
    return (
    <div className="PieChart">
        <Pie data={data} style={{width: "100%"}}/>
    </div>
    );

}

export default PieChart;