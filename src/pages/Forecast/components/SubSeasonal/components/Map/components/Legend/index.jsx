import React from 'react';
import './styles.css';

const Legend = (props) => {
	const { layer } = props;

	const gradientAbove = `linear-gradient(90deg, #ffffff00 0%, #f7fbff 10%, #f7fbff 20%, #dce9f6 30%, #bed8ec 40%, #8fc2de 50%, #5ba3d0 60%, #3282be 70%, #115ca5 80%, #08306b 90%, #08306b 100% )`;
	const gradientBelow = `linear-gradient(90deg, #ffffff00 0%, #fef0d9 10%, #fef0d9 20%, #fddbac 30%, #fdc383 40%, #fc9f67 50%, #f57a4e 60%, #e75438 70%, #ce2a1d 80%, #b30000 90%, #b30000 100% )`;
	const gradientNormal = `linear-gradient(90deg, #ffffff00 0%, #f7fcf5 10%, #f7fcf5 20%, #e2f4dd 30%, #bfe6b9 40%, #94d390 50%, #60ba6c 60%, #329b51 70%, #0d7835 80%, #00441b 90%, #00441b 100% )`;

	const assignBackground = (color, prefix) => {
		switch (prefix) {
		case '0': return { background: gradientAbove };
		case '1': return { background: gradientNormal };
		case '2': return { background: gradientBelow };
		default: return { background: gradientAbove };
		}
	};

	const renderLegend = (color, prefix) => {
		return (
			<div className="single-legend">
				<div className="labels">
					<p>0</p>
					<p>≤ 30</p>
					<p>30 - 35</p>
					<p>35 - 40</p>
					<p>40 - 45</p>
					<p>45 - 50</p>
					<p>50 - 55</p>
					<p>55 - 60</p>
					<p>60 - 65</p>
					<p>65 - 70</p>
					<p>≥ 70</p>
				</div>
				<div
					className="legend"
					style={assignBackground(color, prefix)}
				/>
				{/* <div className="legend-new" /> */}
			</div>
		);
	};

	return (
		<div className="legend-container">
			{renderLegend('#08306b', '0')}
			{renderLegend('#00441b', '1')}
			{renderLegend('#b30000', '2')}
		</div>
	);
};

export default Legend;
