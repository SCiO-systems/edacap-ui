import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import './styles.css';

const DropdownSelection = (props) => {
	const { label, options, search, value, setValue, disabled, optionLabel } = props;

	const [val, setVal] = useState(null);

	useEffect(
		() => {
			options.sort((a, b) => (a.name > b.name ? 1 : -1));
			console.log(options);
		}, []
	);

	return (
		<div className="dropdown">
			<h4>{label}</h4>
			<Dropdown
				value={value || (value === '') ? value : val}
				options={options}
				onChange={value || (value === '') ? (e) => setValue(e.value) : (e) => setVal(e.value)}
				optionLabel={optionLabel}
				filter={!!search}
				filterBy={search ? 'name' : ''}
				disabled={disabled}
			/>
		</div>
	);
};

export default DropdownSelection;
