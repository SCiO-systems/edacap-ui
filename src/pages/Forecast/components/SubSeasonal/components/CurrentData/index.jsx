/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { PieChart, Table, BarChart } from './components';
import './styles.css';

const CurrentData = (props) => {
	const { weatherStationData, semester, selectedWeatherStations } = props;

	const [highestValue, setHighestValue] = useState('');

	useEffect(
		() => {
			if (weatherStationData.graph_data) {
				let temp_max = weatherStationData.graph_data[0];
				weatherStationData.graph_data.map((item) => {
					if (item.value > temp_max.value) {
						temp_max = item;
					}
				});
				switch (temp_max.category) {
				case 'Above': setHighestValue('above'); break;
				case 'Normal': setHighestValue(''); break;
				case 'Below': setHighestValue('below'); break;
				default: break;
				}
			}
		}, [weatherStationData]
	);
	console.log(weatherStationData);
	return (
		<div className="current-data p-card">
			<p className="title">
				For the quarter {semester} in the {selectedWeatherStations?.state?.stateName} state, the climate forecast suggests that precipitation is most likely {highestValue} normal.
			</p>
			<div className="row">
				<div className="chart">
					<p id="chart-title">Precipitation</p>
					{/* <PieChart data={weatherStationData.graph_data} /> */}
					<BarChart data={weatherStationData.graph_data} />
				</div>
				<div className="table">
					<Table table_data={weatherStationData.table_data} />
				</div>
			</div>
		</div>
	);
};

export default CurrentData;
