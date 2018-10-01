import React, {Component} from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from 'victory';

class PitchChart extends Component {
    render() {
        const {data, min, max} = this.props;
        const postTenSec = data.length > 0 && data[data.length - 1].x > 10 * 1000;

        const domain = {
            y: max === 0 || min === max ? [0, 299] : [Math.max(min - 20, 0), max + 20],
            x: postTenSec ? null : [0, 10 * 1000]
        };

        console.log(data, min, max);
        return (
            <div className="PitchChart">
                <VictoryChart height={120}
                              width={500}
                              theme={VictoryTheme.material}
                              padding={{
                                  top: 5,
                                  bottom: 35,
                                  left: 35,
                                  right: 10
                              }}
                              domain={domain}
                    // containerComponent={
                    //     <VictoryVoronoiContainer
                    //         voronoiDimension="x"
                    //         labels={(d) => `y: ${d.y}\np:${d.probability}`}
                    //         labelComponent={
                    //             <VictoryTooltip
                    //                 cornerRadius={0}
                    //             />}
                    //     />}
                >
                    <VictoryAxis
                        label="time [s]"
                        tickFormat={(x) => (`${x / 1000}`)}
                        style={{
                            tickLabels: {
                                fontSize: 7,
                                padding: 0
                            },
                            axisLabel: {
                                padding: 15,
                                fontSize: 8
                            }
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        label="pitch [hz]"
                        tickCount={5}
                        tickFormat={(x) => (`${x}`)}
                        style={{
                            tickLabels: {
                                fontSize: 8,
                                padding: 0
                            },
                            axisLabel: {
                                padding: 20,
                                fontSize: 8
                            }
                        }}
                    />
                    <VictoryLine
                        data={data}
                        interpolation="catmullRom"
                        style={{
                            data: {
                                strokeWidth: 1
                            }
                        }}

                    />
                </VictoryChart>
            </div>
        );
    }
}

export default PitchChart;
