/* eslint-disable react/jsx-no-useless-fragment,no-underscore-dangle */
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as am5xy from '@amcharts/amcharts5/xy';

const HeatMap = (props) => {
	const { data, range } = props;

	const darkMode = useSelector((state) => state.darkMode);

	useEffect(() => {
		const root = am5.Root.new('heatmap');

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
			wheelX: 'none',
			wheelY: 'none',
			layout: root.verticalLayout,
		}));

		// Create axes and their renderers
		const yRenderer = am5xy.AxisRendererY.new(root, {
			visible: false,
			minGridDistance: 20,
			inversed: true,
		});

		yRenderer.grid.template.set('visible', false);

		const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
			maxDeviation: 0,
			renderer: yRenderer,
			categoryField: 'line',
		}));

		const xRenderer = am5xy.AxisRendererX.new(root, {
			visible: false,
			minGridDistance: 30,
			opposite: true,
		});

		xRenderer.grid.template.set('visible', false);

		const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
			renderer: xRenderer,
			categoryField: 'weekday',
		}));

		// Create series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
		const series = chart.series.push(am5xy.ColumnSeries.new(root, {
			calculateAggregates: true,
			stroke: am5.color(0xffffff),
			clustered: false,
			xAxis,
			yAxis,
			categoryXField: 'weekday',
			categoryYField: 'line',
			valueField: 'value',
		}));

		series.columns.template.setAll({
			tooltipText: '{value}',
			strokeOpacity: 1,
			strokeWidth: 2,
			width: am5.percent(100),
			height: am5.percent(100),
		});

		// series.columns.template.events.on('pointerover', (event) => {
		// 	const di = event.target.dataItem;
		// 	if (di) {
		// 		heatLegend.showValue(di.get('value', 0));
		// 	}
		// });
		//
		// series.events.on('datavalidated', () => {
		// 	heatLegend.set('startValue', series.getPrivate('valueHigh'));
		// 	heatLegend.set('endValue', series.getPrivate('valueLow'));
		// });

		// Set up heat rules
		// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
		series.set('heatRules', [{
			target: series.columns.template,
			dataField: 'value',
			key: 'fill',
			customFunction: (sprite, min, max, value) => {
				if (value < range[0]) {
					sprite.set('fill', '#ad5858');
				} else if (value < range[1]) {
					sprite.set('fill', '#ad7e58');
				} else if (value < range[2]) {
					sprite.set('fill', '#abad58');
				} else if (value < range[3]) {
					sprite.set('fill', '#8fad58');
				} else {
					sprite.set('fill', '#69ad58');
				}
			},
		}]);

		// Add heat legend
		// https://www.amcharts.com/docs/v5/concepts/legend/heat-legend/
		// let heatLegend = chart.bottomAxesContainer.children.push(am5.HeatLegend.new(root, {
		// 	orientation: 'horizontal',
		// 	// endColor: am5.color(0xfffb77),
		// 	// startColor: am5.color(0xfe131a),
		// }));
		//
		// const gradient = am5.LinearGradient.new(root, {
		// 	stops: [
		// 		{ color: '#ad5858', offset: 0 },
		// 		{ color: '#ad5858', offset: 0.2 },
		// 		{ color: '#ad7e58', offset: 0.2 },
		// 		{ color: '#ad7e58', offset: 0.4 },
		// 		{ color: '#abad58', offset: 0.4 },
		// 		{ color: '#abad58', offset: 0.6 },
		// 		{ color: '#8fad58', offset: 0.6 },
		// 		{ color: '#8fad58', offset: 0.8 },
		// 		{ color: '#69ad58', offset: 0.8 },
		// 		{ color: '#69ad58', offset: 1 },
		// 	],
		// 	rotation: 0,
		// });

		// heatLegend.children.push(am5.Rectangle.new(root, {
		// 	width: am5.p100,
		// 	height: 40,
		// 	fillGradient: gradient,
		// 	fillOpacity: 1,
		// }));

		series.data.setAll(data);

		xAxis.data.setAll([
			{ weekday: 'Sunday' },
			{ weekday: 'Monday' },
			{ weekday: 'Tuesday' },
			{ weekday: 'Wednesday' },
			{ weekday: 'Thursday' },
			{ weekday: 'Friday' },
			{ weekday: 'Saturday' },
		]);

		yAxis.data.setAll([
			{ line: '1' },
			{ line: '2' },
			{ line: '3' },
			{ line: '4' },
			{ line: '5' },
			{ line: '6' },
		]);

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
		chart.appear(1000, 100);

		return () => root.dispose();
	}, [data, range]);

	return (
		<div id="heatmap" style={{ width: '100%', height: '500px' }} />
	);
};
export default HeatMap;
