/* eslint-disable react/jsx-no-useless-fragment,no-underscore-dangle */
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
// import { Theme as am5themes_Animated } from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';
// import am4themes_https from '@amcharts/amcharts4/themes/https';

const BarChart = (props) => {
	const { data, range } = props;

	const darkMode = useSelector((state) => state.darkMode);

	useEffect(() => {
		/* Chart code */
		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		const root = am5.Root.new('piechart');
		root.setThemes([
			am5themes_Animated.new(root),
		]);

		const chart = root.container.children.push(am5xy.XYChart.new(root, {
			panX: true,
			panY: true,
			wheelX: 'panX',
			wheelY: 'zoomX',
			pinchZoomX: true,
		}));

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
		cursor.lineY.set('visible', false);

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
		xRenderer.labels.template.setAll({
			rotation: -90,
			centerY: am5.p50,
			centerX: am5.p50,
			paddingRight: 15,
		});

		const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
			maxDeviation: 0.3,
			categoryField: 'category',
			renderer: xRenderer,
			tooltip: am5.Tooltip.new(root, {}),
		}));

		const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			maxDeviation: 0.3,
			renderer: am5xy.AxisRendererY.new(root, {}),
		}));

		// Create series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		const series = chart.series.push(am5xy.ColumnSeries.new(root, {
			name: 'Series 1',
			xAxis,
			yAxis,
			valueYField: 'value',
			sequencedInterpolation: true,
			categoryXField: 'category',
			tooltip: am5.Tooltip.new(root, {
				labelText: '{valueY}',
			}),
		}));

		series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
		series.columns.template.adapters.add('fill', (fill, target) => {
			const value = target._dataItem._settings.valueY;
			if (value < range[0]) {
				return '#ad5858';
			} if (value < range[1]) {
				return '#ad7e58';
			} if (value < range[2]) {
				return '#abad58';
			} if (value < range[3]) {
				return '#8fad58';
			} 
			return '#69ad58';
		});
		series.columns.template.adapters.add('stroke', (fill, target) => {
			const value = target._dataItem._settings.valueY;
			if (value < range[0]) {
				return '#ad5858';
			} if (value < range[1]) {
				return '#ad7e58';
			} if (value < range[2]) {
				return '#abad58';
			} if (value < range[3]) {
				return '#8fad58';
			}
			return '#69ad58';
		});

		xAxis.data.setAll(data);
		series.data.setAll(data);

		const exporting = am5plugins_exporting.Exporting.new(root, {
			menu: am5plugins_exporting.ExportingMenu.new(root, {
				align: 'right',
				valign: 'top',
			}),
			filePrefix: 'Bar-Chart',
			dataSource: data,
		});

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		series.appear(1000);
		chart.appear(1000, 100);

		return () => root.dispose();
	}, [data, range]);

	return (
		<div id="piechart" style={{ width: '100%', height: '500px' }} />
	);
};
export default BarChart;
