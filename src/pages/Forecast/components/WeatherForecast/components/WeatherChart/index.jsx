/* eslint-disable consistent-return,react/no-this-in-sfc */
import Highcharts from 'highcharts';
import React, { useEffect } from 'react';
import axios from 'axios';
// import data from '../../../../../../assets/Forecast/testData';
import defaultDictionary from './defaultDictionary';
import newDictionary from './newDictionary';
import './styles.css';

const WeatherChart = (props) => {
	const { data } = props;

	useEffect(
		() => {
			console.log(data);
			function Meteogram(json, container) {
				// Parallel arrays for the chart data, these are populated as the JSON file
				// is loaded
				this.symbols = [];
				this.precipitations = [];
				this.precipitationsError = []; // Only for some data sets
				this.winds = [];
				this.temperatures = [];
				this.pressures = [];
				this.lowestTemp = [];

				// Initialize
				this.json = json;
				this.container = container;

				// Run
				this.parseYrData();
			}

			/**
			 * Mapping of the symbol code in yr.no's API to the icons in their public
			 * GitHub repo, as well as the text used in the tooltip.
			 *
			 * https://api.met.no/weatherapi/weathericon/2.0/documentation
			 */
			Meteogram.dictionary = newDictionary;

			/**
			 * Draw the weather symbols on top of the temperature series. The symbols are
			 * fetched from yr.no's MIT licensed weather symbol collection.
			 * https://github.com/YR/weather-symbols
			 */
			Meteogram.prototype.drawWeatherSymbols = function (chart) {
				chart.series[0].data.forEach((point, i) => {
					// if (this.resolution > 36e5 || i % 2 === 0) {
					// const [symbol, specifier] = this.symbols[i].split('_');
					const symbol = this.symbols[i];
					// const icon = Meteogram.dictionary[symbol].symbol +
					// 	({ day: 'd', night: 'n' }[specifier] || '');

					if (Meteogram.dictionary[symbol]) {
						const icon = `${Meteogram.dictionary[symbol].symbol}d`;
						chart.renderer
							.image(
								'https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols' +
									`@8.0.1/dist/svg/${icon}.svg`,
								point.plotX + chart.plotLeft - 8,
								point.plotY + chart.plotTop - 30,
								30,
								30
							)
							.attr({
								zIndex: 5,
							})
							.add();
					} else {
						console.log(symbol);
					}
					// }
				});
			};

			/**
			 * Draw blocks around wind arrows, below the plot area
			 */
			// Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
			// 	const xAxis = chart.xAxis[0];
			//
			// 	for (
			// 		let pos = xAxis.min, { max } = xAxis, i = 0;
			// 		pos <= max + 36e5; pos += 36e5,
			// 		i += 1
			// 	) {
			// 		// Get the X position
			// 		const isLast = pos === max + 36e5;
			// 		const x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
			//
			// 		// Draw the vertical dividers and ticks
			// 		const isLong = this.resolution > 36e5
			// 			? pos % this.resolution === 0
			// 			: i % 2 === 0;
			//
			// 		chart.renderer
			// 			.path([
			// 				'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
			// 				'L', x, chart.plotTop + chart.plotHeight + 32,
			// 				'Z',
			// 			])
			// 			.attr({
			// 				stroke: chart.options.chart.plotBorderColor,
			// 				'stroke-width': 1,
			// 			})
			// 			.add();
			// 	}
			//
			// 	// Center items in block
			// 	chart.get('windbarbs').markerGroup.attr({
			// 		translateX: chart.get('windbarbs').markerGroup.translateX + 8,
			// 	});
			// };

			/**
			 * Build and return the Highcharts options structure
			 */
			Meteogram.prototype.getChartOptions = function () {
				return {
					chart: {
						renderTo: this.container,
						marginBottom: 70,
						marginRight: 40,
						marginTop: 50,
						plotBorderWidth: 1,
						height: 310,
						alignTicks: false,
						scrollablePlotArea: {
							minWidth: 720,
						},
					},
					defs: {
						patterns: [{
							id: 'precipitation-error',
							path: {
								d: [
									'M', 3.3, 0, 'L', -6.7, 10,
									'M', 6.7, 0, 'L', -3.3, 10,
									'M', 10, 0, 'L', 0, 10,
									'M', 13.3, 0, 'L', 3.3, 10,
									'M', 16.7, 0, 'L', 6.7, 10,
								].join(' '),
								stroke: '#68CFE8',
								strokeWidth: 1,
							},
						}],
					},
					title: {
						text: 'Weather forecast',
						align: 'left',
						style: {
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
						},
					},
					credits: {
						text: 'Forecast from <a href="https://yr.no">yr.no</a>',
						href: 'https://yr.no',
						position: {
							x: -40,
						},
					},
					tooltip: {
						shared: true,
						useHTML: true,
						headerFormat:
							'<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
							'<b>{point.point.symbolName}</b><br>',

					},
					xAxis: [{ // Bottom X axis
						type: 'datetime',
						tickInterval: 2 * 36e5, // two hours
						minorTickInterval: 36e5, // one hour
						tickLength: 0,
						gridLineWidth: 1,
						gridLineColor: 'rgba(128, 128, 128, 0.1)',
						startOnTick: false,
						endOnTick: false,
						minPadding: 0,
						maxPadding: 0,
						offset: 30,
						showLastLabel: true,
						labels: {
							format: '{value:%H}',
						},
						crosshair: true,
					}, { // Top X axis
						linkedTo: 0,
						type: 'datetime',
						tickInterval: 24 * 3600 * 1000,
						labels: {
							format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
							align: 'left',
							x: 3,
							y: 8,
						},
						opposite: true,
						tickLength: 20,
						gridLineWidth: 1,
					}],

					yAxis: [{ // temperature axis
						title: {
							text: null,
						},
						labels: {
							format: '{value}°',
							style: {
								fontSize: '10px',
							},
							x: -3,
						},
						plotLines: [{ // zero plane
							value: 0,
							color: '#BBBBBB',
							width: 1,
							zIndex: 2,
						}],
						maxPadding: 0.3,
						minRange: 8,
						tickInterval: 1,
						gridLineColor: 'rgba(128, 128, 128, 0.1)',

					}, { // precipitation axis
						title: {
							text: null,
						},
						labels: {
							enabled: false,
						},
						gridLineWidth: 0,
						tickLength: 0,
						minRange: 10,
						min: 0,

					}, { // Air pressure
						allowDecimals: false,
						title: { // Title on top of axis
							text: 'hPa',
							offset: 0,
							align: 'high',
							rotation: 0,
							style: {
								fontSize: '10px',
								color: Highcharts.getOptions().colors[2],
							},
							textAlign: 'left',
							x: 3,
						},
						labels: {
							style: {
								fontSize: '8px',
								color: Highcharts.getOptions().colors[2],
							},
							y: 2,
							x: 3,
						},
						gridLineWidth: 0,
						opposite: true,
						showLastLabel: false,
					}],

					legend: {
						enabled: false,
					},

					plotOptions: {
						series: {
							pointPlacement: 'between',
						},
					},

					series: [{
						name: 'Temperature',
						data: this.temperatures,
						type: 'spline',
						marker: {
							enabled: false,
							states: {
								hover: {
									enabled: true,
								},
							},
						},
						tooltip: {
							pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
								'{series.name}: <b>{point.y}°C</b><br/>',
						},
						zIndex: 1,
						color: '#FF3333',
						negativeColor: '#48AFE8',
					}, {
						name: 'Precipitation',
						data: this.precipitationsError,
						type: 'column',
						color: 'url(#precipitation-error)',
						yAxis: 1,
						groupPadding: 0,
						pointPadding: 0,
						tooltip: {
							valueSuffix: ' mm',
							pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
								'{series.name}: <b>{point.minvalue} mm - {point.maxvalue} mm</b><br/>',
						},
						grouping: false,
						dataLabels: {
							enabled: this.hasPrecipitationError,
							filter: {
								operator: '>',
								property: 'maxValue',
								value: 0,
							},
							style: {
								fontSize: '8px',
								color: 'gray',
							},
						},
					}, {
						name: 'Precipitation',
						data: this.precipitations,
						type: 'column',
						color: '#68CFE8',
						yAxis: 1,
						groupPadding: 0,
						pointPadding: 0,
						grouping: false,
						dataLabels: {
							enabled: !this.hasPrecipitationError,
							filter: {
								operator: '>',
								property: 'y',
								value: 0,
							},
							style: {
								fontSize: '8px',
								color: '#666',
							},
						},
						tooltip: {
							valueSuffix: ' mm',
						},
					}, {
						name: 'Air pressure',
						color: Highcharts.getOptions().colors[2],
						data: this.pressures,
						marker: {
							enabled: false,
						},
						shadow: false,
						tooltip: {
							valueSuffix: ' hPa',
						},
						dashStyle: 'shortdot',
						yAxis: 2,
					}, {
						name: 'Lowest Temperature',
						color: Highcharts.getOptions().colors[3],
						data: this.lowestTemp,
						marker: {
							enabled: false,
						},
						shadow: false,
						tooltip: {
							valueSuffix: ' C',
						},
						dashStyle: 'shortdot',
						yAxis: 1,
					},
					// {
					// 	name: 'Wind',
					// 	type: 'windbarb',
					// 	id: 'windbarbs',
					// 	color: Highcharts.getOptions().colors[1],
					// 	lineWidth: 1.5,
					// 	data: this.winds,
					// 	vectorLength: 18,
					// 	yOffset: -15,
					// 	tooltip: {
					// 		valueSuffix: ' m/s',
					// 	},
					// },
					],
				};
			};

			/**
			 * Post-process the chart from the callback function, the second argument
			 * Highcharts.Chart.
			 */
			Meteogram.prototype.onChartLoad = function (chart) {
				this.drawWeatherSymbols(chart);
				// this.drawBlocksForWindArrows(chart);
			};

			/**
			 * Create the chart. This function is called async when the data file is loaded
			 * and parsed.
			 */
			Meteogram.prototype.createChart = function () {
				this.chart = new Highcharts.Chart(this.getChartOptions(), (chart) => {
					this.onChartLoad(chart);
				});
			};

			Meteogram.prototype.error = function () {
				document.getElementById('loading').innerHTML =
					'<i class="fa fa-frown-o"></i> Failed loading data, please try again later';
			};

			/**
			 * Handle the data. This part of the code is not Highcharts specific, but deals
			 * with yr.no's specific data format
			 */
			Meteogram.prototype.parseYrData = function () {
				let pointStart;

				if (!this.json) {
					return this.error();
				}

				// Loop over hourly (or 6-hourly) forecasts
				this.json.properties.timeseries.forEach((node, i) => {
					const x = Date.parse(node.time);
					// const nextHours = node.data.next_1_hours || node.data.next_6_hours;
					// const symbolCode = nextHours && nextHours.summary.symbol_code;
					// const to = node.data.next_1_hours ? x + 36e5 : x + 6 * 36e5;

					// if (to > pointStart + 48 * 36e5) {
					// 	return;
					// }

					// Populate the parallel arrays
					// this.symbols.push(nextHours.summary.symbol_code);

					// this.temperatures.push({
					// 	x,
					// 	y: node.data.instant.details.air_temperature,
					// 	// custom options used in the tooltip formatter
					// 	to,
					// 	symbolName: Meteogram.dictionary[
					// 		symbolCode.replace(/_(day|night)$/, '')
					// 	].text,
					// });

					// this.precipitations.push({
					// 	x,
					// 	y: nextHours.details.precipitation_amount,
					// });

					this.symbols.push(node.data.instant.symbol_code);

					this.temperatures.push({
						x,
						y: node.data.instant.details.air_temperature,
						// custom options used in the tooltip formatter
						// to,
						// symbolName: Meteogram.dictionary[
						// 	symbolCode.replace(/_(day|night)$/, '')
						// ].text,
					});

					this.precipitations.push({
						x,
						y: node.data.instant.details.air_temperature,
					});

					this.lowestTemp.push({
						x,
						y: node.data.instant.details.low_temp,
					});

					if (i % 2 === 0) {
						this.winds.push({
							x,
							value: node.data.instant.details.wind_speed,
							direction: node.data.instant.details.wind_from_direction,
						});
					}

					this.pressures.push({
						x,
						y: node.data.instant.details.air_pressure_at_sea_level,
					});

					// if (i === 0) {
					// 	pointStart = (x + to) / 2;
					// }
				});

				// Create the chart when the data is loaded
				this.createChart();
			};
			// End of the Meteogram protype

			const chart = new Meteogram(data, 'container');
		}, []
	);

	return (
		<figure className="highcharts-figure">
			<div id="container" style={{ width: '100%', height: '400px' }}>
				<div id="loading">
					<i className="fa fa-spinner fa-spin" /> Loading data from external source
				</div>
			</div>
		</figure>
	);
};

export default WeatherChart;
