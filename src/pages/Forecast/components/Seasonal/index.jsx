/* eslint-disable max-len,react/jsx-no-useless-fragment */
/* eslint-disable no-shadow,max-len,no-underscore-dangle,react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { TabView, TabPanel } from 'primereact/tabview';
import L from 'leaflet';
import { ProgressSpinner } from 'primereact/progressspinner';
import Actions from '../../../../reducer/actions';
import { Map, CurrentData, HistoricalData, LayerPanel, BarChart, PointBarChart } from './components';
import StationsService from '../../../../services/httpService/stationsService';
import './styles.css';

const Seasonal = () => {
	const dispatch = useDispatch();

	const weatherStations = useSelector((state) => state.weatherStations);

	const tabLayers = useSelector((state) => state.tabLayers);

	const locationLayer = useSelector((state) => state.locationLayer);

	const boundsLayers = useSelector((state) => state.boundsLayers);

	const seasonalLayersArray = useSelector((state) => state.seasonalLayersArray);
	const setSeasonalLayersArray = (payload) => dispatch({ type: Actions.SetSeasonalLayersArray, payload });

	const [map, setMap] = useState(null);
	const [selectedWeatherStations, setSelectedWeatherStations] = useState(weatherStations[0]);
	const [selectedYear, setSelectedYear] = useState('2022');
	const [semester, setSemester] = useState('June-July-August');
	const [weatherStationData, setWeatherStationData] = useState(null);
	const [historicalData, setHistoricalData] = useState(null);
	const [pointData, setPointData] = useState([]);
	const [squareLayerData, setSquareLayerData] = useState(null);
	const [locationName, setLocationName] = useState('');
	const [toggleSpinner, setToggleSpiner] = useState(false);
	const [time, setTime] = useState('October-November-December');

	useEffect(
		() => {
			if (!map) return;
			const temp = tabLayers.find((item) => item.category === 'seasonal');
			if (temp && locationLayer) {
				const name = 'aclimate_et:seasonal_country_et_dominant';
				const index = 0;
				const variable = 'Above';
				const { x1 } = locationLayer;
				const { x2 } = locationLayer;
				const { y1 } = locationLayer;
				const { y2 } = locationLayer;

				map.createPane(`pane-${index + 1}`);
				map.getPane(`pane-${index + 1}`).style.zIndex = 400 + index;
				
				let timeArgument = '';
				if (time === 'January-February-March') {
					timeArgument = '2023-02-01';
				}
				if (time === 'October-November-December') {
					timeArgument = '2022-11-01';
				}

				if (timeArgument) {
					const wmsLayer = L.singleTileSubSeasonal(`${temp.geoserver_domain}/${temp.workspace}/wms`, [[x1, x2], [y1, y2]], {
						layers: name,
						bbox: `${x2},${x1},${y2},${y1}`,
						width: '700',
						height: '700',
						interactive: true,
						id: index + 2,
						zIndex: index + 1,
						opacity: 1,
						time: timeArgument,
					});
					const layer = {
						layer: wmsLayer,
						configuration: {
							id: index + 2,
							zIndex: index + 1,
							opacity: 1,
							toggled: index === 0,
							// variable,
							name,
						},
					};
					setSeasonalLayersArray([layer]);
				}
			}
		}, [map, weatherStations, time]
	);

	useEffect(
		() => {
			if (selectedWeatherStations && selectedYear && semester) {
				const temp = semester === 'June-July-August' ? 7 : 10;
				StationsService.getWeatherStationData(selectedWeatherStations.weatherStationId, selectedYear, temp)
					.then((res) => {
						setWeatherStationData(res.forecast_graphs);
					});
				StationsService.getWeatherStationHistoricalData(selectedWeatherStations.weatherStationId)
					.then((res) => {
						setHistoricalData(res.historical_graphs);
					});
			} else {
				setWeatherStationData(null);
			}
		}, [selectedWeatherStations, selectedYear, semester]
	);

	const renderData = () => {
		if (weatherStationData) {
			return (
				<TabView>
					<TabPanel header="Current Data">
						<CurrentData weatherStationData={weatherStationData} semester={semester} selectedWeatherStations={selectedWeatherStations} />
					</TabPanel>
					<TabPanel header="Historical Data">
						{historicalData ? <HistoricalData historicalData={historicalData} selectedWeatherStations={selectedWeatherStations} semester={semester} /> : <></>}
					</TabPanel>
				</TabView>
			);
		}
		return null;
	};

	const itemTemplate = (item) => {
		if (!item) {
			return 'Select a weather station';
		}
		return (
			<div className="item-template">
				<p>{item?.state?.stateName} -</p>
				<p>{item?.municipality?.municipalityName} -</p>
				<p>({item?.externalId})</p>
			</div>
		);
	};

	const renderResults = () => (
		<>
			{squareLayerData
				? (
					<div className="area-chart">
						<BarChart data={squareLayerData} label={locationName} />
					</div>
				)
				: <></>
			}
			{pointData.length
				? (
					<div className="area-chart">
						<PointBarChart data={pointData} label={locationName} />
					</div>
				)
				: <></>
			}
		</>
	);

	const renderSpinner = () => {
		if (toggleSpinner) {
			const element = document.getElementById('climate-page');
			if (element) {
				const rect = element.getBoundingClientRect();
				const w = rect.width;
				const h = rect.height;
				return (
					<div className="spinner-container" style={{ width: w, height: h }}>
						<ProgressSpinner />
					</div>
				);
			}
		}
		return <></>;
	};

	return (
		<div className="climate-data-page" id="climate-page">
			<div className="header p-card">
				<p>
					The multi-model ensemble seasonal forecasts have been provided at 4km resolution for six month
					lead time. The forecast is updated each month and improved re-forecast datasets, and we provide
					a more comprehensive range of output data and model and ensemble forecast skill.
				</p>
			</div>
			<div className="map-filters">
				{
					tabLayers.length && boundsLayers.length
						? (
							<div className="date-and-map">
								<SelectButton value={time} options={['October-November-December', 'January-February-March']} onChange={(e) => setTime(e.value)} />
								<Map
									map={map}
									setMap={setMap}
									setSelectedWeatherStations={setSelectedWeatherStations}
									setSquareLayerData={setSquareLayerData}
									pointData={pointData}
									setPointData={setPointData}
									setLocationName={setLocationName}
									setToggleSpiner={setToggleSpiner}
								>
									{renderResults()}
								</Map>
							</div>
						)
						: null
				}
				{/* <div className="layers-and-chart"> */}
				{/*	 <div className="layers-panel"> */}
				{/*		<LayerPanel /> */}
				{/*	 </div> */}
				{/*	 {renderResults()} */}
				{/* </div> */}
			</div>
			{/* <TabView> */}
			{/*	<TabPanel header="Weather Station Data"> */}
			<div className="seasonal-historical">
				<h3>Weather Station Data</h3>
				<div className="filter-row">
					<div className="column" id="station">
						<p>Select Weather Station</p>
						<Dropdown
							id="station"
							value={selectedWeatherStations}
							options={weatherStations}
							onChange={(e) => setSelectedWeatherStations(e.value)}
							optionLabel="externalId"
							placeholder="Select a weather station"
							filter
							filterBy="state.stateName, municipality.municipalityName, externalId"
							valueTemplate={itemTemplate}
							itemTemplate={itemTemplate}
						/>
					</div>
					<div className="column" id="year">
						<p>Select Year</p>
						<Dropdown id="year" value={selectedYear} options={['2022']} onChange={(e) => setSelectedYear(e.value)} placeholder="Select the Year" disabled={!selectedWeatherStations} />
					</div>
					<div className="column">
						<p>Select semester</p>
						<SelectButton value={semester} options={['June-July-August', 'September-October-November']} onChange={(e) => setSemester(e.value)} disabled={!selectedYear} />
					</div>
				</div>
				{renderData()}
			</div>
			{renderSpinner()}
		</div>
	);
};

export default Seasonal;
