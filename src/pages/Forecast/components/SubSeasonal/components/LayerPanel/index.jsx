/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../../../../reducer/actions';
import './styles.css';

const LayerPanel = () => {
	const dispatch = useDispatch();

	const seasonalLayersArray = useSelector((state) => state.seasonalLayersArray);
	const setSeasonalLayersArray = (payload) => dispatch({ type: Actions.SetSeasonalLayersArray, payload });

	const [value, setValue] = useState([]);

	useEffect(
		() => {
			if (seasonalLayersArray.length) {
				console.log(seasonalLayersArray);
				seasonalLayersArray.sort((a, b) => a.configuration.zIndex - b.configuration.zIndex);
				setValue(seasonalLayersArray.map((item) => item.configuration).reverse());
			}
		}, [seasonalLayersArray]
	);

	const onRowReorder = (e) => {
		console.log(e.value);
		setValue(e.value);
		const newLayersArray = e.value.map((item, index) => {
			const temp = seasonalLayersArray.find((layer) => layer.configuration.id === item.id);
			return { layer: temp.layer,
				configuration: {
					id: item.id,
					zIndex: 3 - index,
					opacity: 1,
					toggled: item.toggled,
					variable: temp.configuration.variable,
					name: temp.configuration.name } };
		});
		newLayersArray.sort((a, b) => a.configuration.zIndex - b.configuration.zIndex);
		setSeasonalLayersArray([...newLayersArray]);
	};
	const updateToggled = (id, status) => {
		const temp = seasonalLayersArray.find((item) => item.configuration.id === id);
		const newLayer = { layer: temp.layer,
			configuration: {
				id: temp.configuration.id,
				zIndex: temp.configuration.zIndex,
				opacity: 1,
				toggled: status,
				variable: temp.configuration.variable,
				name: temp.configuration.name } };
		const newLayersArray = seasonalLayersArray.filter((item) => item.configuration.id !== id);
		newLayersArray.push(newLayer);
		newLayersArray.sort((a, b) => a.configuration.zIndex - b.configuration.zIndex);
		setSeasonalLayersArray([...newLayersArray]);
	};

	const toggleTemplate = (data) => (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Checkbox inputId="binary" checked={data.toggled} onChange={(e) => updateToggled(data.id, !data.toggled)} />
		</div>
	);

	const layerNameTemplate = (data) => <p style={{ color: 'black' }}>{data.variable} (%)</p>;
	return (
		<DataTable
			value={value}
			emptyMessage="No Available Layers"
			onRowReorder={onRowReorder}
			reorderableRows
			showGridlines
		>
			<Column field="toggle" header="Toggle" body={toggleTemplate} style={{ width: '5%' }} />
			<Column body={layerNameTemplate} header="Precipitation Layers" style={{ fontFamily: 'Lato' }} />
			{/* <Column field="opacity" header="Opacity" body={sliderTemplate} style={{ }} /> */}
			{/* <Column field="zoom" body={zoomTemplate} style={{ }} /> */}
			<Column rowReorder rowReorderIcon="fad fa-arrows" header="Reorder" style={{ width: '5%' }} />
		</DataTable>
	);
};

export default LayerPanel;
