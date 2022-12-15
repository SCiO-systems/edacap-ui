import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

const TestChart = () => {
	useEffect(
		() => {
			const chart = Highcharts.chart('container2', {
				chart: {
					type: 'bar',
				},
				title: {
					text: 'Fruit Consumption',
				},
				xAxis: {
					categories: ['Apples', 'Bananas', 'Oranges'],
				},
				yAxis: {
					title: {
						text: 'Fruit eaten',
					},
				},
				series: [{
					name: 'Jane',
					data: [1, 0, 4],
				}, {
					name: 'John',
					data: [5, 7, 3],
				}],
			});
		}, []
	);

	return (
		<div id="container2" style={{ width: '400px', height: '400px' }} />
	);
};

export default TestChart;
