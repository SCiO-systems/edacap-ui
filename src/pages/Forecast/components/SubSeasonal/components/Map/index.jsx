/* eslint-disable no-shadow,max-len,no-underscore-dangle,react/jsx-no-useless-fragment,no-trailing-spaces */
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar, Legend } from './components';
import 'leaflet-geoserver-request/src/L.Geoserver';
import '../../../../../../utils/singleTile';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet-draw';
import './styles.css';
import Actions from '../../../../../../reducer/actions';
import CountryService from '../../../../../../services/httpService/countryService';
import WeatherService from '../../../../../../services/httpService/weatherService';

const Map = (props) => {
	const { setSelectedWeatherStations, setSquareLayerData, pointData, setPointData, setLocationName, setToggleSpiner, map, setMap, children } = props;

	const dispatch = useDispatch();

	const boundsLayers = useSelector((state) => state.boundsLayers);

	const locationLayer = useSelector((state) => state.locationLayer);

	const resizeMap = useSelector((state) => state.resizeMap);

	const weatherStations = useSelector((state) => state.weatherStations);

	const subSeasonalLayersArray = useSelector((state) => state.subSeasonalLayersArray);

	const tabLayers = useSelector((state) => state.tabLayers);

	const [legend, setLegend] = useState(null);
	// const [pointData, setPointData] = useState([]);
	const [popup, setPopup] = useState(null);
	const [coordinates, setCoordinates] = useState(null);
	const [markerPopup, setMarkerPopup] = useState(null);
	const [markerContent, setMarkerContent] = useState(null);
	const [autocompleteLayer, setAutocompleteLayer] = useState(null);
	const [boundsLayerLevel, setBoundsLayerLevel] = useState('level2');
	const [boundsLayer, setBoundsLayer] = useState(boundsLayers[1]);

	const layersConfigurations = useRef();

	const mapRef = (element) => {
		setMap(element);
	};

	useEffect(
		() => {
			if (!map) return;
			if (subSeasonalLayersArray.length) {
				let highestLayerIndex = -1;
				subSeasonalLayersArray.map((item) => {
					map.eachLayer((layer) => {
						if ((layer.options.id === item.configuration.id)) {
							map.removeLayer(layer);
						}
					});
					if (item.configuration.toggled) {
						item.layer.addTo(map);
						if (item.configuration.zIndex > highestLayerIndex) {
							highestLayerIndex = item.configuration.zIndex;
						}
					}
				});

				const highestIndexLayer = subSeasonalLayersArray.find((item) => item.configuration.zIndex === highestLayerIndex);
				if (highestIndexLayer) {
					const temp = tabLayers.find((item) => item.category === 'seasonal');
					if (temp) {
						console.log(highestIndexLayer.configuration);
						setLegend(highestIndexLayer.configuration);
						// setLegend(<img
						// 	src={`${temp.geoserver_domain}/${temp.workspace}/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=60&layer=${highestIndexLayer.configuration.name}`}
						// 	alt="legend"
						// 	style={{ position: 'absolute', bottom: '55px', right: '22px', zIndex: '1001', height: '80%' }}
						// />);
					}
				} else {
					setLegend(null);
					// setLegend(<></>);
				}
			}
		}, [map, subSeasonalLayersArray]
	);

	useEffect(
		() => {
			if (!map) return;
			if (locationLayer) {
				const markers = L.markerClusterGroup();
				weatherStations.map((item, index) => {
					const temp = L.marker(item.coordinates, { id: index });
					temp.on({
						click: (e) => {
							setSelectedWeatherStations(item);
							setMarkerContent(item);
							setMarkerPopup(L.popup({
								closeButton: false,
								offset: [0, -20],
							})
								.setLatLng(item.coordinates)
							);
						},
					});
					markers.addLayer(temp);
				});
				map.addLayer(markers);
			}
		}, [map, locationLayer, weatherStations]
	);

	useEffect(
		() => {
			if (!map) return;

			map.createPane(`pane-0`);
			map.getPane(`pane-0`).style.zIndex = 399;
			map.fitBounds(boundsLayer.getBounds());
			map.setMaxBounds(boundsLayer.getBounds());
			map.zoomControl.setPosition('topleft');
			map.options.maxZoom = 14;
			map.addLayer(boundsLayer);
			const layerControl = {
				'Admin Level 2': boundsLayers[1],
				'Admin Level 3': boundsLayers[2],
			};
			L.control.layers(layerControl, [], {
			}).addTo(map);

			map.on('baselayerchange', (e) => {
				switch (e.name) {
				case 'Admin Level 2': setBoundsLayerLevel('level2'); break;
				case 'Admin Level 3': setBoundsLayerLevel('level3'); break;
				default: setBoundsLayerLevel('level2'); break;
				}
			});

			const editableLayers = new L.FeatureGroup();

			map.on(L.Draw.Event.CREATED, (e) => {
				const type = e.layerType;
				switch (type) {
				case 'marker': {
					editableLayers.eachLayer((layer) => {
						editableLayers.removeLayer(layer);
					});
					drawnMarkerClick(e.layer);
					e.layer.on({
						click: (e) => drawnMarkerClick(e.target),
						mouseover: (e) => {
							renderTooltip(e.target, 'Click to get data for this point');
						},
					});
					break;
				}
				case 'circlemarker': {
					editableLayers.eachLayer((layer) => {
						editableLayers.removeLayer(layer);
					});
					setPointData([]);
					drawnCircleMarkerClick(e.layer);
					e.layer.on({
						click: (e) => drawnCircleMarkerClick(e.target),
					});
					break;
				}
				default: {
					editableLayers.eachLayer((layer) => {
						editableLayers.removeLayer(layer);
					});
					e.layer.options.color = '#1245ee';
					e.layer.options.zIndex = 1001;
					e.layer.options.id = 1;
					setLocationName('Intersection of Areas');
					map.eachLayer((layer) => {
						if (layer.options.id === 1) {
							layer.remove();
						}
					});
					setPointData([]);
					setSquareLayerData(null);
					e.layer.setStyle({ color: '#1245ee', opacity: 1 });
					drawnSquareClick(e.layer, '', '');
					break;
				}
				}
				editableLayers.addLayer(e.layer);
			});

			map.addLayer(editableLayers);

			layersConfigurations.current = [];

			const options = {
				position: 'topleft',
				draw: {
					polyline: false,
					circle: false,
					polygon: false,
					marker: true,
					// circlemarker: {
					// 	icon: L.icon({
					// 		iconUrl: 'my-icon.png',
					// 		iconSize: [38, 95],
					// 		iconAnchor: [22, 94],
					// 		popupAnchor: [-3, -76],
					// 		shadowUrl: 'my-icon-shadow.png',
					// 		shadowSize: [68, 95],
					// 		shadowAnchor: [22, 94],
					// 	}),
					// },
					rectangle: {
						shapeOptions: {
							color: '#1245ee',
						},
					},
				},
				edit: {
					featureGroup: editableLayers, // REQUIRED!!
					edit: false,
				},
			};

			const drawControl = new L.Control.Draw(options);
			map.addControl(drawControl);
		}, [map]
	);

	useEffect(
		() => {
			if (!map) return;
			setTimeout(() => {
				map.invalidateSize();
			}, 500);
		}, [resizeMap]
	);

	useEffect(
		() => {
			if (pointData.length) {
				popup.setContent(
					`<div>
						<p>
							<strong>Latitude:</strong> ${(Math.round(coordinates[0] * 100) / 100).toFixed(2)}<br/>
							<strong>Longitude:</strong> ${(Math.round(coordinates[1] * 100) / 100).toFixed(2)}<br/>
						</p>
					</div>`)
					.openOn(map);
			}
		}, [pointData]
	);
	useEffect(
		() => {
			if (markerPopup) {
				markerPopup.setContent(
					`<p>
						<strong>State:</strong> ${markerContent.state.stateName}<br/>
						<strong>Municipality:</strong> ${markerContent.municipality.municipalityName}<br/>
						<strong>Station Id:</strong> ${markerContent.externalId}<br/>
					</p>`)
					.openOn(map);
			}
		}, [markerPopup]
	);

	useEffect(
		() => {
			if (autocompleteLayer) {
				const layer = L.geoJSON(autocompleteLayer, {
					id: 1,
					opacity: 1,
					style: { fillOpacity: 0.5, fillColor: '#1245ee', opacity: 1, weight: 2, color: '#1245ee' },
				});
				map.eachLayer((layer) => {
					if (layer.options.id === 1) {
						layer.remove();
					}
				});
				layer.addTo(map);
				drawnSquareClick(layer, '2', autocompleteLayer.features[0].properties.GID_2);
			}
		}, [autocompleteLayer]
	);

	const renderTooltip = (layer, text) => {
		layer.bindTooltip(text, { direction: 'top' }).addTo(map);
	};

	const drawnCircleMarkerClick = (marker) => {
		const lati = marker.getLatLng().lat;
		const long = marker.getLatLng().lng;
		let level = 2;
		if (boundsLayerLevel === 'level3') {
			level = 3;
		}
		CountryService.getAdminLevelByPoint(long, lati, 'high', level)
			.then((res) => {
				setLocationName(`${res.geo_json[0].properties.NAME_0} - ${res.geo_json[0].properties.NAME_1} - ${res.geo_json[0].properties.NAME_2}`);
				setSquareLayerData(null);
				// eslint-disable-next-line new-cap
				const layer = new L.geoJSON(res.geo_json[0], {
					id: 1,
					opacity: 1,
					style: { fillOpacity: 0.5, fillColor: '#1245ee', opacity: 1, weight: 2, color: '#1245ee' },
				});
				drawnSquareClick(layer, '2', res.geo_json[0].properties.GID_2);
				marker.remove();
				map.eachLayer((layer) => {
					if (layer.options.id === 1) {
						layer.remove();
					}
				});
				layer.addTo(map);
			});
	};

	const drawnSquareClick = (layer, level, id) => {
		const x1 = layer.getBounds()._southWest.lat;
		const x2 = layer.getBounds()._southWest.lng;
		const y1 = layer.getBounds()._northEast.lat;
		const y2 = layer.getBounds()._northEast.lng;
		const bbox = {
			bottom_left_lat: x1,
			bottom_left_lon: x2,
			top_right_lat: y1,
			top_right_lon: y2,
		};
		setCoordinates([(y1 - x1) / 2, (y2 - x2) / 2]);
		setPopup(L.popup({
			closeButton: false,
		})
			.setLatLng([(y1 - x1) / 2, (y2 - x2) / 2])
		);
		const json = layer.toGeoJSON();
		getSquareData(json, level, id);
	};

	const getSquareData = (json, level, id) => {
		const layers = tabLayers[0].layers.map((item) => item.name);
		setToggleSpiner(true);
		WeatherService.getStatisticsCalculation(layers, json, level, id)
			.then((res) => {
				const temp = res.statistics.map((item) => {
					switch (item.layer_short_name) {
					case 'Above': return { ...item, color: '#08306b' };
					case 'Normal': return { ...item, color: '#00441b' };
					case 'Below': return { ...item, color: '#b30000' };
					default: return { ...item, color: 0x08306b };
					}
				});
				setSquareLayerData(temp);
				setToggleSpiner(false);
			});
	};

	const drawnMarkerClick = (marker) => {
		const x1 = marker.getLatLng().lat;
		const x2 = marker.getLatLng().lng;
		const y1 = marker.getLatLng().lat + 1;
		const y2 = marker.getLatLng().lng + 1;
		const bbox = `${x2},${x1},${y2},${y1}`;
		setCoordinates([marker.getLatLng().lat, marker.getLatLng().lng]);
		setPopup(L.popup({
			closeButton: false,
		})
			.setLatLng([marker.getLatLng().lat, marker.getLatLng().lng])
		);
		setToggleSpiner(true);
		CountryService.getAdminLevelByPoint(x2, x1, 'high', 2)
			.then((res) => {
				getPointData(bbox);
				setLocationName(`${res.geo_json[0].properties.NAME_0} - ${res.geo_json[0].properties.NAME_1} - ${res.geo_json[0].properties.NAME_2}`);
			});
	};

	const getPointData = (bbox) => {
		// setPointData([]);
		const temp = tabLayers.find((item) => item.category === 'seasonal');
		const domain = `${temp.geoserver_domain}/${temp.workspace}/ows`;
		const data = [];
		let url = `${domain}?service=WMS&request=GetFeatureInfo&QUERY_LAYERS=${temp.layers[0].name}&x=0&y=0&LAYERS=${temp.layers[0].name}&BBOX=${bbox}&width=1&height=1&INFO_FORMAT=application/json`;
		axios.get(url)
			.then((res) => {
				data.push({ value: res.data.features[0].properties.GRAY_INDEX, category: temp.layers[0].variable });
				url = `${domain}?service=WMS&request=GetFeatureInfo&QUERY_LAYERS=${temp.layers[1].name}&x=0&y=0&LAYERS=${temp.layers[1].name}&BBOX=${bbox}&width=1&height=1&INFO_FORMAT=application/json`;
				axios.get(url)
					.then((res) => {
						data.push({ value: res.data.features[0].properties.GRAY_INDEX, category: temp.layers[1].variable });
						url = `${domain}?service=WMS&request=GetFeatureInfo&QUERY_LAYERS=${temp.layers[2].name}&x=0&y=0&LAYERS=${temp.layers[2].name}&BBOX=${bbox}&width=1&height=1&INFO_FORMAT=application/json`;
						axios.get(url)
							.then((res) => {
								data.push({ value: res.data.features[0].properties.GRAY_INDEX, category: temp.layers[2].variable });
								setPointData(data);
								setSquareLayerData(null);
								setToggleSpiner(false);
							});
					});
			});
	};

	const resetZoom = () => {
		console.log(boundsLayer.getBounds());
		map.fitBounds(boundsLayer.getBounds());
	};

	return (
		<div className="map-component">
			{children}
			<MapContainer
				ref={mapRef}
				scrollWheelZoom
				center={{ lat: 51.505, lng: -0.09 }}
				zoom={5}
			>
				<TileLayer
					attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
					url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
				/>
			</MapContainer>
			<SearchBar setAutocompleteLayer={setAutocompleteLayer} level={boundsLayerLevel} />
			{/* {legend || <></>} */}
			{/* {legend ? <Legend layer={legend} /> : <></>} */}
			<div className="reset-zoom" role="button" tabIndex="0" onClick={resetZoom}>
				<i className="fa-duotone fa-house" />
			</div>
		</div>
	);
};

export default Map;
