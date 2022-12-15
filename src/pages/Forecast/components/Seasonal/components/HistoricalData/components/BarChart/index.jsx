import * as am5 from '@amcharts/amcharts5';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';
import { Theme as am5themes_Animated } from '@amcharts/amcharts5';
import React, { useEffect, useRef } from 'react';
import * as am5xy from '@amcharts/amcharts5/xy';

const BarChart = (props) => {
	const { data, category, label } = props;

	useEffect(() => {
		const root = am5.Root.new('barchart');

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
			categoryField: 'month',
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
				text: label,
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
			categoryXField: 'month',
			tooltip: am5.Tooltip.new(root, {
				labelText: '{valueY}',
			}),
		}));

		series.columns.template.adapters.add('fill', (fill, target) => {
			switch (category) {
			case 'Precipitation': return '#8c9bca';
			case 'Maximum temperature': return '#ffa1a1';
			case 'Minimum temperature': return '#ffcba1';
			case 'Solar radiation': return '#ffe4a1';
			default: return 'black';
			}
		});
		series.columns.template.adapters.add('stroke', (fill, target) => {
			switch (category) {
			case 'Precipitation': return '#8c9bca';
			case 'Maximum temperature': return '#ffa1a1';
			case 'Minimum temperature': return '#ffcba1';
			case 'Solar radiation': return '#ffe4a1';
			default: return 'black';
			}
		});

		series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
		// series.columns.template.adapters.add('fill', (fill, target) => chart.get('colors').getIndex(series.columns.indexOf(target)));
		//
		// series.columns.template.adapters.add('stroke', (stroke, target) => chart.get('colors').getIndex(series.columns.indexOf(target)));

		xAxis.data.setAll(data);
		series.data.setAll(data);

		const exporting = am5plugins_exporting.Exporting.new(root, {
			menu: am5plugins_exporting.ExportingMenu.new(root, {
				align: 'right',
				valign: 'top',
			}),
			filePrefix: 'Historical Barchart data',
			dataSource: data,
		});

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		series.appear(1000);
		chart.appear(1000, 100);

		return () => root.dispose();
	}, [category]);

	return (
		<div id="barchart" style={{ width: '100%', height: '500px' }} />
	);
};
export default BarChart;
