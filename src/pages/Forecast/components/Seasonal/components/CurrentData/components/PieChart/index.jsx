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

const PieChart = (props) => {
	const { data } = props;

	const darkMode = useSelector((state) => state.darkMode);

	useEffect(() => {
		/* Chart code */
		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		const root = am5.Root.new('piechart');

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
			am5themes_Animated.new(root),
		]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
		const chart = root.container.children.push(am5percent.PieChart.new(root, {
			layout: root.verticalLayout,
		}));

		// Create series
		// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
		const series = chart.series.push(am5percent.PieSeries.new(root, {
			valueField: 'value',
			categoryField: 'category',
		}));

		series.labels.template.setAll({
			textType: 'adjusted',
			fontSize: 10,
			wrap: true,
			radius: 0,
			oversizedBehavior: 'wrap',
			maxWidth: 100,
			textAlign: 'center',
			inside: true,
			fill: 'black',
			text: '{category}',
			// textType: 'circular',
			// inside: true,
			// radius: 10,
		});
		series.slices.template.adapters.add('fill', (fill, target) => {
			switch (target._dataItem._settings.category) {
			case 'Above': return '#08306b';
			case 'Normal': return '#00441b';
			case 'Below': return '#b30000';
			default: return 'black';
			}
		});
		series.slices.template.adapters.add('stroke', (fill, target) => {
			switch (target._dataItem._settings.category) {
			case 'Above': return '#08306b';
			case 'Normal': return '#00441b';
			case 'Below': return '#b30000';
			default: return 'black';
			}
		});

		// series.ticks.template.set('visible', false);
		// Set data
		// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
		series.data.setAll(data);

		// Create legend
		// https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
		const legend = chart.children.push(am5.Legend.new(root, {
			centerX: am5.percent(50),
			x: am5.percent(50),
			marginTop: 15,
			marginBottom: 15,
		}));

		legend.data.setAll(series.dataItems);

		const exporting = am5plugins_exporting.Exporting.new(root, {
			menu: am5plugins_exporting.ExportingMenu.new(root, {
				align: 'right',
				valign: 'top',
			}),
			filePrefix: 'Bar-Chart',
			dataSource: data,
		});

		// Play initial series animation
		// https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
		series.appear(1000, 100);

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		chart.appear(1000, 100);

		return () => root.dispose();
	}, [darkMode, data]);

	return (
		<div id="piechart" style={{ width: '100%', height: '500px' }} />
	);
};
export default PieChart;
