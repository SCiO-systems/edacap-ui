/* eslint-disable no-underscore-dangle,new-cap */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import Gleap from 'gleap';
import PrimeReact from 'primereact/api';
import Leaflet from 'leaflet';
import Actions from './reducer/actions';
import MenuBar from './components/MenuBar';
import { Home, Advisory, Forecast, Reports, AboutUs } from './pages';
import Loader from './components/Loader';
import GeneralService from './services/httpService/generalService';
import CountryService from './services/httpService/countryService';
import StationsService from './services/httpService/stationsService';
import { http } from './services/httpService';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@fortawesome/fontawesome-pro/css/all.css';
import '@fortawesome/fontawesome-pro/css/fontawesome.css';
import './App.css';

PrimeReact.ripple = true;

const App = () => {
	const dispatch = useDispatch();

	const forecastSubPage = useSelector((state) => state.forecastSubPage);
	const setForecastSubPage = (payload) => dispatch({ type: Actions.SetForecastSubPage, payload });

	const locationLayer = useSelector((state) => state.locationLayer);
	const setLocationLayer = (payload) => dispatch({ type: Actions.SetLocationLayer, payload });

	const tabLayers = useSelector((state) => state.tabLayers);
	const setTabLayers = (payload) => dispatch({ type: Actions.SetTabLayers, payload });

	const adminAreaNames = useSelector((state) => state.adminAreaNames);
	const setAdminAreaNames = (payload) => dispatch({ type: Actions.SetAdminAreaNames, payload });

	const setWeatherStations = (payload) => dispatch({ type: Actions.SetWeatherStations, payload });

	const setBoundsLayers = (payload) => dispatch({ type: Actions.SetBoundsLayers, payload });

	const [toggleToast, setToggleToast] = useState(0);
	const [toggleLoader, setToggleLoader] = useState(false);

	const toast = useRef(null);

	useEffect(
		() => {
			http.interceptors.request.use(
				(config) => {
					setToggleLoader(true);
					return config;
				},
				(error) => {
					console.log(error);
					return Promise.reject(error);
				}
			);
			http.interceptors.response.use(
				(response) => {
					console.log(response);
					setToggleLoader(false);
					return response;
				},
				(error) => {
					console.log(error);
					return Promise.reject(error);
				}
			);

			GeneralService.getTabLayers()
				.then((res) => {
					setTabLayers(res.tabs);
				});
			if (process.env.REACT_APP_ENVIRONMENT !== 'dev') {
				Gleap.initialize('pk43Ui6l5Gc5mXJZDJJVofNvQZDb9DSw');
			}

			CountryService.getAdminLevels(1)
				.then((re) => {
					const data1 = [];
					const layers = [];
					const newLayer1 = new Leaflet.geoJSON(re.admin_level_data, {
						id: 0,
						style: {
							fillColor: '#d2d2d2',
							color: 'black',
							fillOpacity: 0.5,
							weight: 2 },
						onEachFeature: (feature, layer) => getAreaNamesByLevel(feature, layer, data1, 1),
					});
					layers.push(newLayer1);
					CountryService.getAdminLevels(2)
						.then((res) => {
							const data2 = [];
							const newLayer2 = new Leaflet.geoJSON(res.admin_level_data, {
								id: 0,
								style: {
									fillColor: '#d2d2d2',
									color: '#414141',
									fillOpacity: 0.5,
									weight: 2 },
								onEachFeature: (feature, layer) => getAreaNamesByLevel(feature, layer, data2, 2),
							});
							layers.push(newLayer2);
							CountryService.getAdminLevels(3)
								.then((r) => {
									const data3 = [];
									const newLayer3 = new Leaflet.geoJSON(r.admin_level_data, {
										id: 0,
										style: {
											fillColor: '#d2d2d2',
											color: '#696969',
											fillOpacity: 0.5,
											weight: 2 },
										onEachFeature: (feature, layer) => getAreaNamesByLevel(feature, layer, data3, 3),
									});
									layers.push(newLayer3);
									const data = { level1: data1, level2: data2, level3: data3 };
									setAdminAreaNames(data);
									setBoundsLayers(layers);
								});
						});
				});
		}, []
	);

	useEffect(
		() => {
			if (locationLayer) {
				const { x1 } = locationLayer;
				const { x2 } = locationLayer;
				const { y1 } = locationLayer;
				const { y2 } = locationLayer;
				StationsService.getWeatherStationsByBbox(x1, x2, y1, y2)
					.then((res) => {
						setWeatherStations(res.weather_stations);
					});
			} else setWeatherStations([]);
		}, [locationLayer]
	);

	useEffect(
		() => {
			if (toggleToast) {
				toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Coming soon', life: 3000 });
			}
		}, [toggleToast]
	);

	const getAreaNamesByLevel = (feature, layer, data, level) => {
		switch (level) {
		case 1: data.push({ name: feature.properties.NAME_1 }); return null;
		case 2: data.push({ name: feature.properties.NAME_2, area: feature.properties.NAME_1 }); return null;
		case 3: data.push({ name: feature.properties.NAME_3, area: feature.properties.NAME_2 }); return null;
		default: return null;
		}
	};

	return (
		<div className="app">
			{toggleLoader ? <Loader /> : null}
			<Toast ref={toast} />
			<Router>
				<MenuBar setToggleToast={setToggleToast} />
				<Routes>
					<Route exact path="/" element={<Navigate replace to="/Home" />} />
					<Route path="/Home" element={<Home setToggleToast={setToggleToast} />} />
					<Route path="/Advisory" element={<Advisory />} />
					<Route path="/Forecast" element={<Forecast />} />
					<Route path="/Reports" element={<Reports />} />
					<Route path="/About" element={<AboutUs />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
