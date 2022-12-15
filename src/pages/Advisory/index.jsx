import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map, BarChart, HeatMap, Legend } from './components';
import Actions from '../../reducer/actions';
import CropService from '../../services/httpService/cropService';
import './styles.css';

const Advisory = () => {
	const dispatch = useDispatch();

	const crop = useSelector((state) => state.crop);

	const cultivar = useSelector((state) => state.cultivar);

	const soil = useSelector((state) => state.soil);

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	const [selectedWeatherStation, setSelectedWeatherStation] = useState(null);
	const [data, setData] = useState(null);
	const [heatChartData, setHeatChartData] = useState([]);
	const [barChartData, setBarChartData] = useState([]);
	const [range, setRange] = useState([]);

	// const range = [3000, 5000, 7000, 9000];

	const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco';

	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	useEffect(
		() => {
			setCurrentPage('home');
		}, []
	);

	useEffect(
		() => {
			// CropService.getYield(selectedWeatherStation.weatherStationId, soil.id, cultivar.id)
			CropService.getYield('5ebad2694c06b707e80d6cef', '5f3449bb9d1c560d04cad636', '5e9e3a69e5c43a1604522d6f')
				.then((res) => {
					setData(res.yield);
				});
			// CropService.getRange(selectedWeatherStation.weatherStationId, crop.id)
			CropService.getRange('5ebad2694c06b707e80d6cef', '5e91e25414daf81260ebbaeb')
				.then((res) => {
					console.log(res.ranges);
					setRange([res.ranges[0].upper, res.ranges[1].upper, res.ranges[2].upper, res.ranges[3].upper]);
				});
		}, [selectedWeatherStation]
	);

	useEffect(
		() => {
			if (data) {
				const barChart = [];
				const heatChart = [];
				data.map((item) => {
					const temp = new Date(item.date);
					heatChart.push({ weekday: days[temp.getDay()], line: getWeekOfMonth(temp) + 1, value: item.data.avg });
					barChart.push({ category: temp, value: item.data.avg });
				});
				setHeatChartData(heatChart);
				setBarChartData(barChart);
			}
		}, [data]
	);

	const getWeekOfMonth = (d) => {
		const date = d.getDate();
		const day = d.getDay();

		const weekOfMonth = Math.ceil((date - 1 - day) / 7);
		return weekOfMonth;
	};

	const headerSection = (title, text) => {
		return (
			<div className="header-section">
				<h4>{title}</h4>
				<p>{text}</p>
			</div>
		);
	};

	return (
		<div className="advisory">
			<div className="header p-card">
				{headerSection('Pre-season advisory', lorem)}
				{headerSection('In-season advisory', lorem)}
				{headerSection('Alerting', lorem)}
			</div>
			<div className="map p-card">
				<h3>Select a weather station</h3>
				<Map setSelectedWeatherStation={setSelectedWeatherStation} />
			</div>
			<div className="crop-advisory p-card p-grid">
				<div className="title p-col-12">
					<h2>Crop Advisory</h2>
					<p>{`${crop.cp_name} - ${cultivar.name} - ${soil.name}`}</p>
				</div>
				<div className="container p-card">
					<h2>Planting Dates</h2>
					<div className="calendars">
						<HeatMap data={heatChartData} range={range} />
					</div>
				</div>
				<div className="container p-card p-col-3">
					<h2>Average Potential yield</h2>
					<BarChart data={barChartData} range={range} />
				</div>
				<Legend range={range} />
			</div>
		</div>
	);
};

export default Advisory;
