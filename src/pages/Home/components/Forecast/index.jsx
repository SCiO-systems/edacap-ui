import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { Map } from './components';
import Card from '../../../../components/Card';
import './styles.css';

const Forecast = (props) => {
	const { data, setLocation } = props;

	const navigate = useNavigate();

	const [chooseLocationDialog, setChooseLocationDialog] = useState(false);
	const [newLocation, setNewLocation] = useState(null);

	const renderCards = () => {
		return data.map((item) => {
			return <Card data={item} />;
		});
	};

	const chooseLocationDialogFooter = () => {
		return (
			<div>
				<Button
					label="Save Location"
					onClick={() => {
						setChooseLocationDialog(false);
						if (newLocation) {
							setLocation([...newLocation]);
						}
					}}
				/>
				<Button label="Cancel" onClick={() => setChooseLocationDialog(false)} />
			</div>
		);
	};

	return (
		<div className="forecast">
			<div className="forecast-panel p-card">
				<div className="weather-forecast-header">
					<h2>Weather Forecast</h2>
					<Button label="Choose Location" onClick={() => setChooseLocationDialog(true)} />
				</div>
				<div className="cards p-grid align-items-stretch">
					{renderCards()}
				</div>
				{/* <Button label="Other Forecast" /> */}
			</div>
			<Dialog header="Choose a Location" visible={chooseLocationDialog} style={{ width: '90vw', height: '90vh' }} footer={chooseLocationDialogFooter} onHide={() => setChooseLocationDialog(false)}>
				<Map setLocation={setNewLocation} />
			</Dialog>
		</div>
	);
};

export default Forecast;
