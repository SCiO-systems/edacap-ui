import React from 'react';
import Card from '../../../../../../components/Card';
import './styles.css';

const CardView = (props) => {
	const { data } = props;

	const timestampToDate = (datas) => {
		const temp = new Date(datas * 1000);
		return (
			<span style={{ color: 'black' }}>{temp.toLocaleTimeString()}</span>
		);
	};

	const renderIcon = (weather) => {
		switch (weather) {
		case 'Light rain': return <i className="fa-regular fa-cloud-drizzle" />;
		case 'Scattered clouds': return <i className="fa-regular fa-clouds" />;
		case 'Moderate rain': return <i className="fa-regular fa-cloud-rain" />;
		case 'Broken clouds': return <i className="fa-regular fa-clouds-sun" />;
		case 'Few clouds': return <i className="fa-regular fa-sun-cloud" />;
		case 'Light shower rain': return <i className="fa-regular fa-cloud-drizzle" />;
		case 'Heavy rain': return <i className="fa-regular fa-cloud-showers-heavy" />;
		default: return null;
		}
	};

	const renderCards = () => data.map((item) => <Card data={item} />);

	return (
		<div className="card-view">
			<div className="card-view-grid p-grid p-col-12">
				{renderCards()}
			</div>
		</div>
	);
};

export default CardView;
