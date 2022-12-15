/* eslint-disable no-shadow,max-len,no-underscore-dangle,react/jsx-no-useless-fragment,no-trailing-spaces */
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { useSelector } from 'react-redux';
import 'leaflet-geoserver-request/src/L.Geoserver';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet-draw';
import './styles.css';

const Map = (props) => {
	const { setLocation } = props;

	const boundsLayers = useSelector((state) => state.boundsLayers);

	const [map, setMap] = useState(null);

	const [boundsLayer, setBoundsLayer] = useState(boundsLayers[0]);

	const mapRef = (element) => {
		setMap(element);
	};

	useEffect(
		() => {
			setLocation(null);
			if (!map) return;

			map.createPane(`pane-0`);
			map.getPane(`pane-0`).style.zIndex = 399;
			map.fitBounds(boundsLayer.getBounds());
			map.zoomControl.setPosition('topleft');
			map.options.maxZoom = 14;
			map.addLayer(boundsLayer);

			map.on('click', (e) => {
				map.eachLayer((layer) => {
					if ((layer.options.id === 'marker')) {
						map.removeLayer(layer);
					}
				});
				const marker = L.marker([e.latlng.lat, e.latlng.lng], {
					id: 'marker',
				}).addTo(map);
				drawnMarkerClick(marker);
				marker.on({
					click: (e) => {
						drawnMarkerClick(marker);
					},
				});
			}
			);
		}, [map]
	);

	const drawnMarkerClick = (marker) => {
		const x1 = marker.getLatLng().lat;
		const x2 = marker.getLatLng().lng;
		setLocation([x1, x2]);
	};

	const resetZoom = () => {
		map.fitBounds(boundsLayer.getBounds());
	};

	return (
		<div className="map-component">
			<MapContainer
				ref={mapRef}
				scrollWheelZoom
				center={{ lat: 51.505, lng: -0.09 }}
				zoom={5}
			>
				<TileLayer
					attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
					url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
				/>
			</MapContainer>
			{/* <div className="reset-zoom" role="button" tabIndex="0" onClick={resetZoom}> */}
			{/*	<i className="fa-duotone fa-house" /> */}
			{/* </div> */}
		</div>
	);
};

export default Map;
