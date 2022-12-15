import React, { useEffect } from 'react';
import './styles.css';

const Card = (props) => {
	const { data } = props;

	const datetime = data.datetime.split('-');
	const newDatetimeFormat = `${datetime[2]} - ${datetime[1]} - ${datetime[0]}`;

	const renderIcon = (weather) => {
		switch (weather) {
		case 'Light rain': return <i className="fa-regular fa-cloud-drizzle" />;
		case 'Scattered clouds': return <i className="fa-regular fa-clouds" />;
		case 'Moderate rain': return <i className="fa-regular fa-cloud-rain" />;
		case 'Broken clouds': return <i className="fa-regular fa-clouds-sun" />;
		case 'Few clouds': return <i className="fa-regular fa-sun-cloud" />;
		case 'Light shower rain': return <i className="fa-regular fa-cloud-drizzle" />;
		case 'Heavy rain': return <i className="fa-regular fa-cloud-showers-heavy" />;
		case 'Clear Sky': return <i className="fa-regular fa-sun" />;
		case 'Thunderstorm with rain': return <i className="fa-regular fa-cloud-bolt" />;
		default: return null;
		}
	};

	return (
		<div className="forecast-card p-card">
			{renderIcon(data.weather)}
			<p id="weather">{data.weather}</p>
			<p id="temperature">{data.app_max_temp}°C</p>
			<p id="date">{newDatetimeFormat}</p>
			<div className="divider" />
			<p>Precipitation: {data.rh}%</p>
			<p>Wind Speed: {data.wind_spd}</p>

		</div>
	);
};

export default Card;
