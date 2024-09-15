import { LineElement, PointElement, LinearScale, CategoryScale, Chart, Tooltip, Title } from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from 'chartjs-plugin-annotation';
import styles from "./ObesityChartStyles.module.css";

Chart.register([annotationPlugin, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Title]);

function getColorForPercentage(percentage) {
    const color1 = [121, 98, 50];
    const color2 = [0, 90, 49];

    let h = (color2[0] - color1[0]) * percentage + color1[0];
    let s = (color2[1] - color1[1]) * percentage + color1[1];
    let l = (color2[2] - color1[2]) * percentage + color1[2];

    return `hsl(${h},${s}%,${l}%)`;
}

let width, height, gradient;

function getGradient(ctx, chartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;

    if (!gradient || width !== chartWidth || height !== chartHeight) {
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        gradient.addColorStop(0, "rgb(242,96,5)");
        gradient.addColorStop(0.25, "rgb(3,252,7)");
        gradient.addColorStop(1, "rgb(237,12,12)");
    }

    return gradient;
}

function ObesityChart({bmi}) {
    const bmiRanges = ["BMI is less than 18.5", "BMI is 18.5 to 24.9", "BMI is 25 to 29.9", "BMI is 30 or higher"]

    if (bmi > 30) {
        bmi = 30
    }
    else if (bmi < 18.75) {
        bmi = 18.75
    }

    return (
        <div className={styles.chartContainer}>
            <Line
                data={{
                    labels: ["Underweight", "Normal Weight", "Overweight", "Obese"],
                    datasets: [
                        {
                            data: [0, 0, 0, 0],
                            borderColor: function(context) {
                                const chart = context.chart;
                                const {ctx, chartArea} = chart;

                                if (!chartArea) {
                                    return;
                                }

                                return getGradient(ctx, chartArea);
                            },
                            borderWidth: 8,
                            pointBackgroundColor: "black",
                            pointBorderWidth: 1,
                            lineTension: 0,
                            pointBorderColor: "white",
                            pointRadius: 8,
                            pointHoverRadius: 10,
                        }
                    ]
                }}
                options={{
                    plugins: {
                        datalabels: {
                            align: 'top',
                            formatter: function(value, context) {
                                return context.dataIndex + 1;
                            }
                        },
                        tooltip: {
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    let label = bmiRanges[context.dataIndex];
                                
                                    return label;
                                }
                            }
                        },
                        annotation: {
                            annotations: {
                                point1: {
                                    type: 'point',
                                    xValue: 3 * (bmi - 18.75) / 11.25,
                                    yValue: 0,
                                    backgroundColor: 'rgba(255, 99, 132, 0.25)',
                                    radius: 16
                                }
                            }
                        }
                    },
                    layout: {
                        padding: {
                            right: 10
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    scales: {
                        y: {
                            ticks: {
                                display: false
                            },
                            grid: {
                                display: false
                            },
                            border: {
                                display: false
                            }
                        },
                        x: {
                            ticks: {
                                display: true,
                            },
                            grid: {
                                display: false,
                            },
                            border: {
                                display: false
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

export default ObesityChart;