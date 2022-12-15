/* eslint-disable max-len,no-underscore-dangle */
import * as am5 from '@amcharts/amcharts5';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';
import { Theme as am5themes_Animated } from '@amcharts/amcharts5';
import React, { useEffect, useRef } from 'react';
import * as am5xy from '@amcharts/amcharts5/xy';

const PointBarChart = (props) => {
	const { data, label } = props;

	useEffect(() => {
		const root = am5.Root.new('pointbarchart');

		const myTheme = am5.Theme.new(root);
		myTheme.rule('RoundedRectangle').setAll({
			fill: am5.color(0xFF0000),
		});

		root.setThemes([
			myTheme,
			am5themes_Animated.new(root),
		]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		const chart = root.container.children.push(am5xy.XYChart.new(root, {
			panX: true,
			panY: true,
			wheelX: 'panX',
			wheelY: 'zoomX',
			pinchZoomX: true,
			layout: root.verticalLayout,
		}));

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
		cursor.lineY.set('visible', false);

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
		xRenderer.labels.template.setAll({
			rotation: 0,
			centerY: am5.p50,
			centerX: am5.p50,
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

		yAxis.children.unshift(
			am5.Label.new(root, {
				rotation: -90,
				text: 'Precipitation (mm)',
				y: am5.p50,
				centerX: am5.p50,
			})
		);

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

		xAxis.data.setAll(data);
		series.data.setAll(data);

		const exporting = am5plugins_exporting.Exporting.new(root, {
			menu: am5plugins_exporting.ExportingMenu.new(root, {
				align: 'right',
				valign: 'top',
			}),
			filePrefix: 'Point data',
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
		series.appear(1000);
		chart.appear(1000, 100);

		return () => root.dispose();
	}, []);

	return (
		<div id="pointbarchart" style={{ width: '100%', height: '100%' }} />
	);
};
export default PointBarChart;
