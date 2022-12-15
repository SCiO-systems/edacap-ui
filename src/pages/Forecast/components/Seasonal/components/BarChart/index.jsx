/* eslint-disable no-underscore-dangle */
import * as am5 from '@amcharts/amcharts5';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';
import { Theme as am5themes_Animated } from '@amcharts/amcharts5';
import React, { useEffect, useRef } from 'react';
import * as am5xy from '@amcharts/amcharts5/xy';

const BarChart = (props) => {
	const { data, label } = props;

	useEffect(() => {
		const root = am5.Root.new('barplot');

		console.log(data);

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

		const xRenderer = am5xy.AxisRendererX.new(root, {
			minGridDistance: 30,
		});

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
			categoryField: 'layer_short_name',
			renderer: xRenderer,
		}));

		// Enable label wrapping
		xRenderer.labels.template.setAll({
			oversizedBehavior: 'wrap',
			textAlign: 'center',
		});

		xAxis.data.setAll(data);

		const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			renderer: am5xy.AxisRendererY.new(root, {}),
			numberFormat: '#.##',
		}));

		yAxis.get('renderer').labels.template.setAll({
			oversizedBehavior: 'truncate',
			maxWidth: 150,
		});

		yAxis.children.unshift(
			am5.Label.new(root, {
				rotation: -90,
				text: 'Precipitation (mm)',
				y: am5.p50,
				centerX: am5.p50,
			})
		);

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		function makeSeries(name, fieldName) {
			const series = chart.series.push(am5xy.ColumnSeries.new(root, {
				name,
				xAxis,
				yAxis,
				valueYField: fieldName,
				categoryXField: 'layer_short_name',
			}));

			series.columns.template.setAll({
				tooltipText: '{name}, {categoryX}:{valueY}',
				width: am5.percent(90),
				tooltipY: 0,
			});

			series.columns.template.adapters.add('fill', (fill, target) => {
				switch (target._dataItem._settings.categoryX) {
				case 'Above': return '#8c9bca';
				case 'Normal': return '#b2e0c5';
				case 'Below': return '#ffa1a1';
				default: return 'black';
				}
			});
			series.columns.template.adapters.add('stroke', (fill, target) => {
				switch (target._dataItem._settings.categoryX) {
				case 'Above': return '#8c9bca';
				case 'Normal': return '#b2e0c5';
				case 'Below': return '#ffa1a1';
				default: return 'black';
				}
			});

			series.data.setAll(data);

			// Make stuff animate on load
			// https://www.amcharts.com/docs/v5/concepts/animations/
			series.appear();

			// legend.data.push(series);
		}

		makeSeries('Mean', 'mean');
		makeSeries('Minimum', 'min');
		makeSeries('Maximum', 'max');
		makeSeries('Standard Deviation ', 'standard_deviation');

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
	}, [data]);

	const assignColor = (layer) => {
		switch (layer) {
		case 'Above': return 0x08306b;
		case 'Normal': return 0x00441b;
		case 'Below': return 0xb30000;
		default: return 0x08306b;
		}
	};

	return (
		<div id="barplot" style={{ width: '100%', height: '100%' }} />
	);
};
export default BarChart;
