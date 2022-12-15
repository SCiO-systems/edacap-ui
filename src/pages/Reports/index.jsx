import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useDispatch } from 'react-redux';
// import { Chart, Map, Table } from '../Forecast/components/Seasonal/components';
import Actions from '../../reducer/actions';
import FakeChart from '../../components/FakeChart';
import './styles.css';

const Reports = () => {
	const dispatch = useDispatch();

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	const [value, setValue] = useState(null);
	const [date1, setDate1] = useState();

	useEffect(
		() => {
			setCurrentPage('reports');
		}, []
	);
	
	return (
		<div className="reports">
			<div className="container p-card">
				<div className="header">
					<h2>Report</h2>
					<div className="actions">
						<Dropdown value={value} options={[]} onChange={(e) => setValue(e.value)} placeholder="Year" />
						<Button label="Export" />
					</div>
				</div>
				<div className="p-grid gap-8 justify-content-center">
					<div className="cell p-card p-col-3">
						<h3>Seasonal</h3>
						{/* <Chart /> */}
					</div>
					<div className="cell p-card p-col-3">
						<h3>Pre-Seasonal</h3>
						{/* <Table /> */}
					</div>
					<div className="cell p-card p-col-3">
						<h3>Average Potential Yield</h3>
						<FakeChart id="1" />
					</div>
					<div className="cell p-card p-col-3">
						<h3>Average Potential Yield</h3>
						<Calendar
							id="basic"
							value={date1}
							onChange={(e) => setDate1(e.value)}
							inline
						/>
					</div>
					<div className="cell p-card p-col-3">
						<h3>Average Potential Yield</h3>
						<FakeChart id="2" />
					</div>
					<div className="cell p-card p-col-3">
						<h3>Location</h3>
						{/* <Map /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reports;
