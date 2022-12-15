import React from 'react';
import './styles.css';

const Legend = (props) => {
	const { range } = props;

	return (
		<div className="legend">
			<div className="section" style={{ backgroundColor: '#ad5858' }}>
				<p>Very Low {range[0]}{'<'}</p>
			</div>
			<div className="section" style={{ backgroundColor: '#ad7e58' }}>
				<p>Low [{range[0] + 1} - {range[1]}]</p>
			</div>
			<div className="section" style={{ backgroundColor: '#abad58' }}>
				<p>Middle [{range[1] + 1} - {range[2]}]</p>
			</div>
			<div className="section" style={{ backgroundColor: '#8fad58' }}>
				<p>High [{range[2] + 1} - {range[3]}]</p>
			</div>
			<div className="section" style={{ backgroundColor: '#69ad58' }}>
				<p>Very High {'>'}{range[3] + 1}</p>
			</div>
		</div>
	);
};

export default Legend;
