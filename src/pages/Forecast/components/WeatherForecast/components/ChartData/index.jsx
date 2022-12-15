/* eslint-disable react/jsx-no-useless-fragment */
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { Theme as am5themes_Animated } from '@amcharts/amcharts5';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';

const Timeseries = (props) => {
	const { data } = props;
	useLayoutEffect(() => {
		const root = am5.Root.new(`weather-timeseries-${data[0].property}`);

		root.setThemes([
			am5themes_Animated.new(root),
		]);

		const chart = root.container.children.push(am5xy.XYChart.new(root, {
			panX: true,
			panY: true,
			wheelX: 'panX',
			wheelY: 'zoomX',
			maxTooltipDistance: 0,
			pinchZoomX: true,
			layout: root.verticalLayout,
		}));

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
			numberFormat: '#',
			renderer: am5xy.AxisRendererX.new(root, {}),
			tooltip: am5.Tooltip.new(root, {}),
		}));

		const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			renderer: am5xy.AxisRendererY.new(root, {}),
		}));

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		data.map((item) => {
			const series = chart.series.push(am5xy.LineSeries.new(root, {
				name: `${item.property}`,
				xAxis,
				yAxis,
				valueYField: 'value',
				valueXField: 'day',
				legendValueText: '{valueY}',
				// tooltip: am5.Tooltip.new(root, {
				// 	pointerOrientation: 'horizontal',
				// 	labelText: '{valueY}',
				// }),
			}));

			series.bullets.push((it) => am5.Bullet.new(it, {
				sprite: am5.Circle.new(it, {
					radius: 4,
					fill: series.get('fill'),
					stroke: root.interfaceColors.get('background'),
					strokeWidth: 2,
					tooltipText: '{valueY}',
					showTooltipOn: 'hover',
					tooltip: am5.Tooltip.new(root, {}),
				}),
			}));

			series.data.setAll(item.data);

			// Make stuff animate on load
			// https://www.amcharts.com/docs/v5/concepts/animations/
			series.appear();
		});

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
			behavior: 'none',
		}));
		cursor.lineY.set('visible', false);

		// Add scrollbar
		// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
		chart.set('scrollbarX', am5.Scrollbar.new(root, {
			orientation: 'horizontal',
		}));

		chart.set('scrollbarY', am5.Scrollbar.new(root, {
			orientation: 'vertical',
		}));

		// Add legend
		// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
		const legend = chart.children.push(am5.Legend.new(root, {
			centerX: am5.p50,
			x: am5.p50,
			layout: am5.GridLayout.new(root, {
				maxColumns: 3,
				fixedWidthGrid: true,
			}),
		}));

		// When legend item container is hovered, dim all the series except the hovered one
		legend.itemContainers.template.events.on('pointerover', (e) => {
			const itemContainer = e.target;

			// As series list is data of a legend, dataContext is series
			const series = itemContainer.dataItem.dataContext;

			chart.series.each((chartSeries) => {
				if (chartSeries != series) {
					chartSeries.strokes.template.setAll({
						strokeOpacity: 0.15,
						stroke: am5.color(0x000000),
					});
				} else {
					chartSeries.strokes.template.setAll({
						strokeWidth: 3,
					});
				}
			});
		});

		// When legend item container is unhovered, make all series as they are
		legend.itemContainers.template.events.on('pointerout', (e) => {
			const itemContainer = e.target;
			const series = itemContainer.dataItem.dataContext;

			chart.series.each((chartSeries) => {
				chartSeries.strokes.template.setAll({
					strokeOpacity: 1,
					strokeWidth: 1,
					stroke: chartSeries.get('fill'),
				});
			});
		});

		legend.data.setAll(chart.series.values);

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
		chart.appear(1000, 100);

		return () => root.dispose();
	}, [data]);

	return (
		<div id={`weather-timeseries-${data[0].property}`} style={{ width: '100%', height: '600px' }} />
	);
};
export default Timeseries;
