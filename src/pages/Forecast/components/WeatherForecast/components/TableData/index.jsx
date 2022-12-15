/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './styles.css';
import { useSelector } from 'react-redux';

const TableData = (props) => {
	const { data } = props;

	const dt = useRef(null);

	const role = useSelector((state) => state.role);

	useEffect(
		() => {
			const columns = Object.keys(data);
		}, []
	);

	const header = () => (
		<div className="weather-table-header">
			{/* <h4>Variables Table</h4> */}
			<Button type="button" icon="pi pi-file" onClick={() => exportCSV(dt)} className="mr-2" data-pr-tooltip="CSV" />
		</div>
	);

	const exportCSV = (ref) => {
		ref.current.exportCSV();
	};

	const timestampToDate = (datas) => {
		const temp = new Date(datas * 1000);
		return (
			<p style={{ color: 'black' }}>{temp.toLocaleTimeString()} - {temp.toLocaleDateString()}</p>
		);
	};

	const farmerColumns = () => [
		<Column field="datetime" header="Datetime" />,
		<Column field="rh" header="Humidity" />,
		<Column field="weather" header="Weather" />,
		<Column field="wind_cdir_full" header="Wind Direction" />,
		<Column field="precip" header="Precipitation" />,
	];

	const researcherColumns = [
		<Column field="datetime" header="Datetime" />,
		<Column field="rh" header="Humidity" />,
		<Column field="weather" header="Weather" />,
		<Column field="wind_cdir_full" header="Wind Direction" />,
		<Column field="ozone" header="Ozone" />,
		<Column field="clouds" header="Clouds" />,
		// <Column field="snow" header="Snow" />,
	];

	const renderColumns = () => {
		switch (role) {
		case 'Farmer': return farmerColumns();
		case 'Extension Worker': return researcherColumns;
		case 'Researcher': return researcherColumns;
		case 'High Level Decision Maker': return farmerColumns();
		default: return farmerColumns();
		}
	};

	return (
		<div className="table">
			<DataTable
				value={data}
				responsiveLayout="scroll"
				paginator
				rows={5}
				rowsPerPageOptions={[5, 10, 15]}
				header={header}
				ref={dt}
			>
				{renderColumns()}
			</DataTable>
		</div>
	);
};

export default TableData;
