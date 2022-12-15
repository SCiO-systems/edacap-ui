import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './styles.css';

const Loader = () => {
	console.log('');
	return (
		<div className="loader">
			<ProgressSpinner />
		</div>
	);
};

export default Loader;
