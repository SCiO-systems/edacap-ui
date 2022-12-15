/* eslint-disable consistent-return,react/no-this-in-sfc */
import Highcharts from 'highcharts';
import React, { useEffect } from 'react';
import defaultDictionary from '../WeatherChart/defaultDictionary';
import newDictionary from '../WeatherChart/newDictionary';

const WeatherChart = (props) => {
	const { data } = props;

	useEffect(
		() => {
			const filteredData = [];
			for (const [key, value] of Object.entries(data.properties.timeseries[0].data.instant.details)) {
				if (key === 'temp') {
					filteredData.push({
						name: 'temp',
						text: 'Temperature',
						type: 'line',
						unit: ' C',
					});
				}
				if (key === 'rh') {
					filteredData.push({
						name: 'rh',
						text: 'Precipitation',
						type: 'column',
						unit: ' mm',
					});
				}
				if (key === 'wind_spd') {
					filteredData.push({
						name: 'wind_spd',
						text: 'Wind Speed',
						type: 'line',
						unit: ' m/s',
					});
				}
			}
			const variables = filteredData;

			function Meteogram(json, container) {
				// Parallel arrays for the chart data, these are populated as the JSON file
				// is loaded
				this.symbols = [];

				variables.map((item) => {
					this[item.name] = [];
				});

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
					const symbol = this.symbols[i];
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
					title: {
						text: 'Weather forecast',
						align: 'left',
						style: {
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
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

					series: variables.map((item, index) => {
						return 	{
							name: `${item.text}`,
							color: Highcharts.getOptions().colors[index],
							type: item.type === 'column' ? 'column' : '',
							data: this[item.name],
							marker: {
								enabled: false,
							},
							shadow: false,
							tooltip: {
								valueSuffix: `${item.unit}`,
							},
							dashStyle: 'shortdot',
							yAxis: 1,
						};
					}),
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

					this.symbols.push(node.data.instant.symbol_code);

					variables.map((item) => {
						this[item.name].push({
							x,
							y: node.data.instant.details[item.name],
						});
					});
				});

				this.createChart();
			};

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
