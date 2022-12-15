/* eslint-disable max-len,react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ToggleButton } from 'primereact/togglebutton';
import { Map, ChartData, TableData, CardView, TestChart, WeatherChart, WeatherChart2 } from './components';
import Actions from '../../../../reducer/actions';
import WeatherService from '../../../../services/httpService/weatherService';
import './styles.css';

const WeatherForecast = () => {
	const dispatch = useDispatch();

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	const weatherStations = useSelector((state) => state.weatherStations);

	const boundsLayers = useSelector((state) => state.boundsLayers);

	const role = useSelector((state) => state.role);

	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [data, setData] = useState(null);
	const [location, setLocation] = useState([]);
	const [toggleSpinner, setToggleSpiner] = useState(false);
	const [checked, setChecked] = useState(false);

	useEffect(
		() => {
			setCurrentPage('Historical');
			switch (role) {
			case 'Farmer': setChecked(true); break;
			case 'Extension Worker': setChecked(false); break;
			case 'Researcher': setChecked(false); break;
			case 'High Level Decision Maker': setChecked(true); break;
			default: setChecked(true); break;
			}
		}, [role]
	);

	useEffect(
		() => {
			if (location.length) {
				setToggleSpiner(true);
				WeatherService.getWeatherVariables(location[0], location[1])
					.then((res) => {
						setToggleSpiner(false);
						const newData = filterDataBasedOnRole(res.weather_forecasts);
						console.log(newData);
						// setData(newData);
						setData(res.weather_forecasts);
					});
			}
		}, [role, location]
	);

	useEffect(
		() => {
			if (data) {
				setFilteredData(selectedItems.map((filter) => data.chart_data.find((item) => item.property === filter)));
			}
		}, [selectedItems]
	);

	useEffect(
		() => {
			console.log(data);
		}, [data]
	);

	const filterDataBasedOnRole = (dataToFilter) => {
		let tableData = dataToFilter.table_data;
		let chartData = dataToFilter.chart_data;

		console.log(chartData);

		const temp = chartData.filter((cluster) => cluster.variables.find((item) => ((item.property === 'max_temp') || (item.property === 'min_temp') || (item.property === 'precip') || (item.property === 'rh') || (item.property === 'wind_cdir_full'))));
		const farmerChartData = temp.map((cluster) => {
			const newClusterVariables = cluster.variables.filter((item) => ((item.property === 'max_temp') || (item.property === 'min_temp') || (item.property === 'precip') || (item.property === 'rh') || (item.property === 'wind_cdir_full')));
			return { ...cluster, variables: [...newClusterVariables] };
		});
		// const farmerChartData = chartData.filter((item) => ((item.property === 'max_temp') || (item.property === 'min_temp') || (item.property === 'precip') || (item.property === 'rh') || (item.property === 'wind_cdir_full')));
		const farmerTableData = tableData.map((item) => ({ datetime: item.datetime, weather: item.weather, wind_spd: item.wind_spd, max_temp: item.max_temp, min_temp: item.min_temp, precip: item.precip, rh: item.rh, wind_cdir_full: item.wind_cdir_full }));

		const temp2 = chartData.filter((cluster) => cluster.variables.find((item) => ((item.property !== 'moon_phase') && (item.property !== 'moon_phase_lunation') && (item.property !== 'precip') && (item.property !== 'rh'))));
		const researcherChartData = temp2.map((cluster) => {
			const newClusterVariables = cluster.variables.filter((item) => ((item.property !== 'moon_phase') && (item.property !== 'moon_phase_lunation') && (item.property !== 'precip') && (item.property !== 'rh')));
			return { ...cluster, variables: [...newClusterVariables] };
		});
		// const researcherChartData = chartData.filter((item) => ((item.property !== 'moon_phase') && (item.property !== 'moon_phase_lunation') && (item.property !== 'precip') && (item.property !== 'rh')));
		const researcherTableData = tableData;

		switch (role) {
		case 'Farmer': {
			tableData = farmerTableData;
			chartData = farmerChartData;
			break;
		}
		case 'Extension Worker': {
			tableData = researcherTableData;
			chartData = researcherChartData;
			break;
		}
		case 'Researcher': {
			tableData = researcherTableData;
			chartData = researcherChartData;
			break;
		}
		case 'High Level Decision Maker': {
			tableData = farmerTableData;
			chartData = farmerChartData;
			break;
		}
		default: {
			tableData = farmerTableData;
			chartData = farmerChartData;
			break;
		}
		}
		return { table_data: tableData, chart_data: chartData };
	};

	const renderSpinner = () => {
		if (toggleSpinner) {
			const element = document.getElementById('climate-page');
			if (element) {
				const rect = element.getBoundingClientRect();
				const w = rect.width;
				const h = rect.height;
				return (
					<div className="spinner-container" style={{ width: w, height: h }}>
						<ProgressSpinner />
					</div>
				);
			}
		}
		return <></>;
	};

	const headerTemplate = () => (
		<div className="header-template">
			<p>Weather Predictions</p>

		</div>
	);

	const renderCharts = () => {
		console.log(data.chart_data);
		return data?.chart_data?.map((cluster) => {
			const chartData = cluster.variables.map((item) => ({ data: item.data, property: item.property }));
			console.log(chartData);
			return (
				<div className="p-col-6">
					<ChartData data={chartData} />
				</div>
			);
		});
	};
	
	return (
		<div className="climate-data-page" id="climate-page">
			<div className="weather-forecast">
				{boundsLayers.length
					? (
						<div className="map-container">
							{
								!data
									? (
										<div style={{ padding: '12px' }}>
											<h4>Please select a location by clicking on the map</h4>
										</div>
									)
									: null
							}
							<Map setLocation={setLocation} />
						</div>
					)
					: null}

				{data
					? (
						<>
							<div className="table-and-cards p-card">
								<ToggleButton checked={checked} onChange={(e) => setChecked(e.value)} onLabel="Show Table" offLabel="Show Cards" aria-label="Confirmation" />
								{!checked
									? <TableData data={data.table_data} />
									: <CardView data={data.table_data} />}
							</div>
							{/* <div className="chart2 p-grid"> */}
							{/*	{renderCharts()} */}
							{/* </div> */}
							<div className="map-container">
								{/* <WeatherChart data={data.daily_data} /> */}
								<WeatherChart2 data={data.daily_data} />
							</div>
						</>
					)
					: null
				}

			</div>
			{renderSpinner()}
		</div>
	);
};

export default WeatherForecast;
