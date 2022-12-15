import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownSelection, Forecast, Crop } from './components';
import WeatherService from '../../services/httpService/weatherService';
import './styles.css';
import Actions from '../../reducer/actions';
import kebeles from '../../assets/Home/kebele.json';
import CountryService from '../../services/httpService/countryService';

const Home = (props) => {
	const { setToggleToast } = props;

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	const adminAreaNames = useSelector((state) => state.adminAreaNames);

	const [forecast, setForecast] = useState(false);
	const [crop, setCrop] = useState(false);

	const [location, setLocation] = useState(null);
	const [weatherData, setWeatherData] = useState(null);

	const [region, setRegion] = useState('');
	const [zone, setZone] = useState('');
	const [woreda, setWoreda] = useState('');
	const [kebele, setKebele] = useState('');

	const [zoneOptions, setZoneOptions] = useState([]);
	const [woredaOptions, setWoredaOptions] = useState([]);
	const [kebeleOptions, setKebeleOptions] = useState([]);

	useEffect(
		() => {
			setCurrentPage('home');

			navigator.geolocation.getCurrentPosition((position) => {
				if ((((position.coords.latitude < 14.8454771) && (position.coords.latitude > 3.39882302)) && ((position.coords.longitude > 33.00153732) && (position.coords.longitude < 47.95822906)))) {
					setLocation([position.coords.latitude, position.coords.longitude]);
				} else {
					setLocation([8.428438, 39.388445]);
				}
			}, (error) => {
				if (error.code == error.PERMISSION_DENIED) {
					setLocation([8.428438, 39.388445]);
				}
			});
		}, []
	);

	useEffect(
		() => {
			if (location) {
				WeatherService.getWeatherVariables(location[0], location[1])
					.then((res) => {
						if (res.weather_forecasts) {
							setWeatherData(res.weather_forecasts.table_data);
						}
					});
			}
		}, [location]
	);

	useEffect(
		() => {
			setZoneOptions(adminAreaNames.level2);
			setWoredaOptions(adminAreaNames.level3);
			const temp = kebeles.map((item) => {
				return { name: item.kebele, area: item.woreda };
			});
			setKebeleOptions(temp);
		}, [adminAreaNames]
	);

	useEffect(
		() => {
			if (region) {
				const filteredZones = adminAreaNames.level2.filter((item) => item.area === region.name);
				setZoneOptions(filteredZones);
			}
			setZone('');
		}, [region]
	);

	useEffect(
		() => {
			if (zone) {
				const filteredWoredas = adminAreaNames.level3.filter((item) => item.area === zone.name);
				setWoredaOptions(filteredWoredas);
			}
			setWoreda('');
		}, [zone]
	);

	useEffect(
		() => {
			if (woreda) {
				const temp = kebeles.map((item) => {
					return { name: item.kebele, area: item.woreda };
				});
				const filteredKebeles = temp.filter((item) => item.area === woreda.name);
				setKebeleOptions(filteredKebeles);
			}
			setKebele('');
		}, [woreda]
	);

	useEffect(
		() => {
			CountryService.getKebeleByName(kebele.name)
				.then((res) => {
					console.log(res);
				});
		}, [kebele]
	);

	const renderSubPage = () => {
		if (forecast && weatherData) {
			return <Forecast data={weatherData} setLocation={setLocation} />;
		}
		if (crop && weatherData) {
			return <Crop />;
		}
		return null;
	};

	return (
		<div className="home">
			<div className="header">
				<h1>Welcome to Ethiopian Digital AgroClimae Advisory Platform: EDACaP</h1>
				<p>The Ethiopian Digital Agroclimate Advisory Platform (EDACaP) is an innovative digital web-platform for decision-support and learning that provides interactive demand-driven agroclimate information and advisory to improve crop management decisions and reduce production risks and enhance adaptive capacity of farmers by managing the climate risk</p>
			</div>
			<div className="dropdowns">
				<DropdownSelection label="Region:" options={adminAreaNames instanceof Array ? [] : adminAreaNames.level1} search value={region} setValue={setRegion} optionLabel="name" />
				<DropdownSelection label="Zone:" options={zoneOptions} search value={zone} setValue={setZone} disabled={region === ''} optionLabel="name" />
				<DropdownSelection label="Woreda:" options={woredaOptions} search value={woreda} setValue={setWoreda} disabled={zone === ''} optionLabel="name" />
				<DropdownSelection label="Kebele:" options={kebeleOptions} search value={kebele} setValue={setKebele} disabled={woreda === ''} optionLabel="name" />
			</div>
			<div className="forecast-advisory">
				<Button
					label="Weather Forecast"
					onClick={() => {
						setCrop(false);
						setForecast(!forecast);
					}}
				/>
				<h4>Or</h4>
				<Button
					label="Advisory"
					onClick={() => {
						setForecast(false);
						setCrop(!crop);
						// setToggleToast((prev) => prev + 1);
					}}
				/>
			</div>
			{renderSubPage()}
		</div>
	);
};

export default Home;
