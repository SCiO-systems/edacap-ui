/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { Tooltip } from 'primereact/tooltip';
import { BarChart, Timeseries } from './components';
import './styles.css';

const HistoricalData = (props) => {
	const { historicalData, selectedWeatherStations, semester } = props;

	const [category, setCategory] = useState('Precipitation');
	const [highLowBarChartValues, setHighLowBarChartValues] = useState({ high: { month: '', value: '' }, low: { month: '', value: '' } });

	const justifyOptions = [
		{ icon: 'fa-solid fa-raindrops', value: 'Precipitation' },
		{ icon: 'fa-solid fa-temperature-arrow-up', value: 'Maximum temperature' },
		{ icon: 'fa-solid fa-temperature-arrow-down', value: 'Minimum temperature' },
		{ icon: 'fa-solid fa-sun-bright', value: 'Solar radiation' },
	];

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	useEffect(
		() => {
			const temp = historicalData.find((item) => item.category === category);
			if (temp) {
				const barChartData = temp.bar_chart_data.map((item, index) => ({ month: months[index], value: item.value }));
				console.log(barChartData);
				let high = barChartData[0];
				let low = barChartData[0];
				barChartData.map((item) => {
					if (item.value > high.value) {
						high = item;
					}
					if (item.value < low.value) {
						low = item;
					}
				});
				setHighLowBarChartValues({ high, low });
			}
		}, [historicalData, category]
	);

	const renderCategoryContent = (categoryName) => {
		const temp = historicalData.find((item) => item.category === categoryName);
		const barChartData = temp.bar_chart_data.map((item, index) => ({ month: months[index], value: item.value }));
		const seriesData = temp.line_chart_data.map((item, index) => ({ month: months[index], data: item.data }));
		return (
			<div className="category-content p-card">
				<p className="title">This plot shows {category} average for the last 30 years for each month. The climatology for {category} in the {selectedWeatherStations?.state?.stateName} state, shows us that:</p>
				<p className="title">
					•	Month with the <strong>highest</strong> value is {highLowBarChartValues.high.month} ({highLowBarChartValues.high.value} {temp.unit})
					<br />
					•	Month with the <strong>lowest</strong> value is {highLowBarChartValues.low.month} ({highLowBarChartValues.low.value} {temp.unit})
				</p>
				<div className="chart-container">
					<BarChart data={barChartData} category={category} label={temp.unit} />
				</div>
				<div className="divider" />
				<p className="title">
					This plot shows the historical values of {category}. You can filter the month of interest by clicking on the label.
					<br /><br />
					Historically in the municipality of {selectedWeatherStations?.municipality?.municipalityName}, it presents the following behavior:
				</p>
				<div className="chart-container">
					<Timeseries data={seriesData} category={category} label={temp.unit} months={semester} />
				</div>
			</div>
		);
	};

	const renderCategoryData = () => {
		if (category) {
			return renderCategoryContent(category);
		}
		return (
			<div className="no-category" style={{ height: '500px' }}>
				<p>Please select a category</p>
			</div>
		);
	};

	const justifyTemplate = (option) => (
		<div className={`category-button-template ${option.value[0] + option.value[1]}`} style={{ width: '100%', height: '100%', padding: '0.5rem 1rem' }}>
			<i className={option.icon} />
		</div>
	);

	return (
		<div className="historical-data">
			<Tooltip target=".Pr" content="Precipitation" position="bottom" />
			<Tooltip target=".Ma" content="Maximum temperature" position="bottom" />
			<Tooltip target=".Mi" content="Minimum temperature" position="bottom" />
			<Tooltip target=".So" content="Solar radiation" position="bottom" />
			<SelectButton value={category} options={justifyOptions} onChange={(e) => setCategory(e.value)} itemTemplate={justifyTemplate} optionLabel="value" />
			{renderCategoryData()}
		</div>
	);
};

export default HistoricalData;
