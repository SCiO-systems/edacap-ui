import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DropdownSelection from '../DropdownSelection';
import './styles.css';
import CropService from '../../../../services/httpService/cropService';
import Actions from '../../../../reducer/actions';

const Crop = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const crop = useSelector((state) => state.crop);
	const setCrop = (payload) => dispatch({ type: Actions.SetCrop, payload });

	const cultivar = useSelector((state) => state.cultivar);
	const setCultivar = (payload) => dispatch({ type: Actions.SetCultivar, payload });

	const soil = useSelector((state) => state.soil);
	const setSoil = (payload) => dispatch({ type: Actions.SetSoil, payload });

	const [cropOptions, setCropOptions] = useState([]);
	const [cultivarOptions, setCultivarOptions] = useState([]);
	const [soilsOptions, setSoilOptions] = useState([]);

	// const [crop, setCrop] = useState('');
	// const [cultivar, setCultivar] = useState('');
	// const [soil, setSoil] = useState('');
	
	useEffect(
		() => {
			CropService.getCropCultivarAndSoilVocabularies()
				.then((res) => {
					setCropOptions(res.cropInfo);
				});
		}, []
	);

	useEffect(
		() => {
			if (crop) {
				setCultivarOptions(crop.cultivars);
				setSoilOptions(crop.soils);
			}
		}, [crop]
	);
	
	return (
		<div className="crop-panel p-card">
			<h2>Crop</h2>
			<div className="crops">
				<DropdownSelection label="Crop" value={crop} setValue={setCrop} options={cropOptions} optionLabel="cp_name" />
				<DropdownSelection label="Cultivar" value={cultivar} setValue={setCultivar} options={cultivarOptions} optionLabel="name" disabled={crop === ''} />
				<DropdownSelection label="Soil Type" value={soil} setValue={setSoil} options={soilsOptions} optionLabel="name" disabled={crop === ''} />
			</div>
			<Button label="Advisory" onClick={() => navigate('/Advisory')} disabled={!(crop && cultivar && soil)} />
		</div>
	);
};

export default Crop;
