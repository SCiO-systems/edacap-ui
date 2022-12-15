/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AutoComplete } from 'primereact/autocomplete';
import CountryService from '../../../../../../../../services/httpService/countryService';
import './styles.css';

const SearchBar = (props) => {
	const { setAutocompleteLayer, level } = props;

	const adminAreaNames = useSelector((state) => state.adminAreaNames);

	const [selectedArea, setSelectedArea] = useState('');
	const [filteredAreas, setFilteredAreas] = useState(null);

	useEffect(
		() => {
			if (selectedArea.name) {
				CountryService.getAdminlevelByName(selectedArea.name)
					.then((res) => {
						setAutocompleteLayer(res.geo_jons);
					});
			}
		}, [level, selectedArea]
	);

	const searchCountry = (event) => {
		setTimeout(() => {
			let newFilteredAreas;
			if (!event.query.trim().length) {
				newFilteredAreas = [...adminAreaNames[level]];
			} else {
				newFilteredAreas = adminAreaNames[level].filter((country) => country.name.toLowerCase().startsWith(event.query.toLowerCase()));
			}

			setFilteredAreas(newFilteredAreas);
		}, 250);
	};

	return (
		<AutoComplete value={selectedArea} suggestions={filteredAreas} completeMethod={searchCountry} field="name" onChange={(e) => setSelectedArea(e.value)} placeholder="Search by Admininistration Area Name" />
	);
};

export default SearchBar;
