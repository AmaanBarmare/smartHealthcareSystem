import { ArcElement, Chart, Tooltip, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import styles from "./PredictionChartStyle.module.css";

Chart.register([ArcElement, Tooltip, Title]);

function getColorForPercentage(percentage) {
    const color1 = [121, 98, 50];
    const color2 = [0, 90, 49];

    let h = (color2[0] - color1[0]) * percentage + color1[0];
    let s = (color2[1] - color1[1]) * percentage + color1[1];
    let l = (color2[2] - color1[2]) * percentage + color1[2];

    return `hsl(${h},${s}%,${l}%)`;
}

function PredictionChart({predictionData}) {

    return (
        <div className={styles.chartContainer}>
            <Pie
                data={{
                    labels: predictionData.map(row => row.label),
                        datasets: [
                            {
                                label: "Probability",
                                data: predictionData.map(row => row.value),
                                //backgroundColor: predictionData.map(row => getColorForPercentage(row.good ? 1.0 - row.value : row.value)),
                                backgroundColor: predictionData.map(row => row.good ? getColorForPercentage(0) : getColorForPercentage(1)),
                                borderColor: predictionData.map(row => "rgb(0, 0, 0)"),
                                hoverOffset: 32,
                            }
                        ]
                }}
                options={{
                    radius: "85%",
                    //circumference: 180,
                    //rotation: 90,
                    animation: {
                        animateRotate: true
                    },
                    plugins: {
                        title: {
                            display: true,
                            font: {
                                weight: "bold",
                                size: 32,
                            },
                            color: "rgb(255,255,255)",
                            text: "Possible Health Concerns",
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                
                                    if (label) {
                                        label += ': ';
                                    }
                                
                                    if (context.parsed != null) {
                                        label += `${parseFloat(context.parsed * 100).toFixed(2)}%`;
                                    }
                                
                                    return label;
                                },
                                labelTextColor: function(context) {
                                    if (context.dataset) {
                                        return context.dataset.backgroundColor[context.dataIndex];
                                    }
                                    else {
                                        return "rgb(255,255,255)";
                                    }
                                },
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

export default PredictionChart;