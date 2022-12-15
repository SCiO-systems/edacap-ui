/* eslint-disable no-underscore-dangle */
import * as am5 from '@amcharts/amcharts5';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import React, { useEffect, useRef } from 'react';
import * as am5xy from '@amcharts/amcharts5/xy';

const BarChart = (props) => {
	const { label, id } = props;

	const data = [
		{ value: 200, day: 'M' },
		{ value: 300, day: 'T' },
		{ value: 150, day: 'W' },
		{ value: 220, day: 'Th' },
		{ value: 260, day: 'F' },
		{ value: 70, day: 'S' },
	];

	useEffect(() => {
		const root = am5.Root.new(`${id || 'barplot'}`);

		root.numberFormatter.set('numberFormat', '#.##');

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
			am5themes_Animated.new(root),
		]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		const chart = root.container.children.push(am5xy.XYChart.new(root, {
			panX: false,
			panY: false,
			wheelX: 'panX',
			wheelY: 'zoomX',
			layout: root.verticalLayout,
		}));

		chart.get('colors').set('colors', [
			am5.color(0x000000),
		]);

		// Add legend
		// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
		const legend = chart.children.push(
			am5.Legend.new(root, {
				centerX: am5.p50,
				x: am5.p50,
			})
		);

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
			categoryField: 'day',
			renderer: am5xy.AxisRendererX.new(root, {
				cellStartLocation: 0.1,
				cellEndLocation: 0.9,
			}),
		}));
		xAxis.data.setAll(data);

		const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			renderer: am5xy.AxisRendererY.new(root, {}),
			numberFormat: '#.##',
		}));

		yAxis.get('renderer').labels.template.setAll({
			oversizedBehavior: 'truncate',
			maxWidth: 150,
		});

		// xAxis.children.push(
		// 	am5.Label.new(root, {
		// 		text: 'GDP per Capita, USD',
		// 		x: am5.p50,
		// 		centerX: am5.p50,
		// 	})
		// );

		yAxis.children.unshift(
			am5.Label.new(root, {
				rotation: -90,
				y: am5.p50,
				centerX: am5.p50,
			})
		);

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		function makeSeries(fieldName) {
			const series = chart.series.push(am5xy.ColumnSeries.new(root, {
				xAxis,
				yAxis,
				valueYField: fieldName,
				categoryXField: 'day',
			}));

			series.columns.template.setAll({
				tooltipText: '{categoryX}:{valueY}',
				width: am5.percent(90),
				tooltipY: 0,
			});

			series.data.setAll(data);

			// Make stuff animate on load
			// https://www.amcharts.com/docs/v5/concepts/animations/
			series.appear();

			// legend.data.push(series);
		}

		makeSeries('value');

		const exporting = am5plugins_exporting.Exporting.new(root, {
			menu: am5plugins_exporting.ExportingMenu.new(root, {
				align: 'right',
				valign: 'top',
			}),
			filePrefix: 'Area Data',
			dataSource: data,
		});

		chart.children.unshift(am5.Label.new(root, {
			text: label,
			fontSize: 18,
			fontWeight: '500',
			textAlign: 'center',
			x: am5.percent(50),
			centerX: am5.percent(50),
			y: am5.percent(0),
			paddingTop: -10,
			paddingBottom: 0,
		}));

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		chart.appear(1000, 100);

		return () => root.dispose();
	}, []);

	return (
		<div id={`${id || 'barplot'}`} style={{ width: '100%', height: '300px' }} />
	);
};
export default BarChart;
