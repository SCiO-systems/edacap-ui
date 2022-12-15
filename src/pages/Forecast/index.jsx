import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Seasonal, SubSeasonal, WeatherForecast } from './components';
import './styles.css';
import Actions from '../../reducer/actions';

const Forecast = () => {
	const dispatch = useDispatch();

	const forecastSubPage = useSelector((state) => state.forecastSubPage);

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	useEffect(
		() => {
			window.scrollTo(0, 0);
			setCurrentPage('forecast');
		}, []
	);

	const renderSubPage = () => {
		switch (forecastSubPage) {
		case 'seasonal': return <Seasonal />;
		case 'sub-seasonal': return <SubSeasonal />;
		case 'weather': return <WeatherForecast />;
		default: return <Seasonal />;
		}
	};

	return (
		<div className="forecast-page">
			{renderSubPage()}
		</div>
	);
};

export default Forecast;
