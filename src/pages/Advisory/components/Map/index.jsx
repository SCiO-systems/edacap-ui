/* eslint-disable no-shadow,max-len,no-underscore-dangle,react/jsx-no-useless-fragment,no-trailing-spaces */
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet-geoserver-request/src/L.Geoserver';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet-draw';
import './styles.css';

const Map = (props) => {
	const { setSelectedWeatherStation } = props;

	const dispatch = useDispatch();

	const boundsLayers = useSelector((state) => state.boundsLayers);

	const locationLayer = useSelector((state) => state.locationLayer);

	const resizeMap = useSelector((state) => state.resizeMap);

	const weatherStations = useSelector((state) => state.weatherStations);

	const [markerPopup, setMarkerPopup] = useState(null);
	const [markerContent, setMarkerContent] = useState(null);
	const [boundsLayer, setBoundsLayer] = useState(boundsLayers[0]);
	const [map, setMap] = useState(null);

	const layersConfigurations = useRef();

	const mapRef = (element) => {
		setMap(element);
	};

	useEffect(
		() => {
			if (!map) return;
			if (locationLayer) {
				const markers = L.markerClusterGroup();
				weatherStations.map((item, index) => {
					const temp = L.marker(item.coordinates, { id: index });
					temp.on({
						click: (e) => {
							setSelectedWeatherStation(item);
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
			if (markerPopup) {
				console.log(markerPopup);
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

	const renderTooltip = (layer, text) => {
		layer.bindTooltip(text, { direction: 'top' }).addTo(map);
	};

	const resetZoom = () => {
		map.fitBounds(boundsLayer.getBounds());
	};

	return (
		<div className="" style={{ width: '100%' }}>
			<div className="map-component">
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
				<div className="reset-zoom" role="button" tabIndex="0" onClick={resetZoom}>
					<i className="fa-duotone fa-house" />
				</div>
			</div>
		</div>
	);
};

export default Map;
