/* eslint-disable max-len */
import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Parser } from 'json2csv';

const Table = (props) => {
	const { table_data } = props;

	const [expandedRows, setExpandedRows] = useState(null);

	const rowExpansionTemplate = (data) => (
		<DataTable value={data.items} responsiveLayout="scroll">
			<Column field="month" header="month" />
			<Column field="minimum" header="minimum" />
			<Column field="average" header="average" />
			<Column field="maximum" header="maximum" />
		</DataTable>
	);

	const exportButton = (data) => {
		return (
			<div className="flex align-items-center export-buttons">
				<Button type="button" icon="pi pi-file" onClick={() => newExport(data)} />
			</div>
		);
	};

	const newExport = (data) => {
		const parser = new Parser();
		const csv = parser.parse(data.items);
		console.log(csv);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);

		// Create a link to download it
		const pom = document.createElement('a');
		pom.href = url;
		pom.setAttribute('download', 'data.csv');
		pom.click();
	};

	const bodyTemplate = (data) => (
		<p>{data.category} ({data.unit})</p>
	);

	return (
		<DataTable
			value={table_data}
			expandedRows={expandedRows}
			onRowToggle={(e) => setExpandedRows(e.data)}
			responsiveLayout="scroll"
			rowExpansionTemplate={rowExpansionTemplate}
			dataKey="category"
			exportField
			showGridlines
		>
			<Column expander style={{ width: '3em' }} />
			<Column field="category" body={bodyTemplate} header="Category" />
			<Column field="export" body={exportButton} />
		</DataTable>
	);
};

export default Table;
