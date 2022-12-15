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
	const { setLocation } = props;

	const resizeMap = useSelector((state) => state.resizeMap);

	const boundsLayers = useSelector((state) => state.boundsLayers);

	const [map, setMap] = useState(null);

	const [markerPopup, setMarkerPopup] = useState(null);
	const [markerContent, setMarkerContent] = useState(null);
	const [boundsLayer, setBoundsLayer] = useState(boundsLayers[1]);

	// const layersConfigurations = useRef();

	const mapRef = (element) => {
		setMap(element);
	};

	useEffect(
		() => {
			if (!map) return;

			map.createPane(`pane-0`);
			map.getPane(`pane-0`).style.zIndex = 399;
			map.fitBounds(boundsLayer.getBounds());
			map.zoomControl.setPosition('topleft');
			map.options.maxZoom = 14;
			map.addLayer(boundsLayer);

			// const editableLayers = new L.FeatureGroup();

			map.on('click', (e) => {
				const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
				drawnMarkerClick(marker);
				marker.on({
					click: (e) => drawnMarkerClick(marker),
				});
				// editableLayers.addLayer(marker);
			}
			);

			// map.on(L.Draw.Event.CREATED, (e) => {
			// 	drawnMarkerClick(e.layer);
			// 	e.layer.on({
			// 		click: (e) => drawnMarkerClick(e.target),
			// 	});
			// 	editableLayers.addLayer(e.layer);
			// });

			// map.addLayer(editableLayers);

			// layersConfigurations.current = [];

			// const options = {
			// 	position: 'topleft',
			// 	draw: {
			// 		polyline: false,
			// 		circle: false,
			// 		polygon: false,
			// 		marker: true,
			// 		circlemarker: false,
			// 		rectangle: false,
			// 	},
			// 	edit: {
			// 		featureGroup: editableLayers, // REQUIRED!!
			// 		edit: false,
			// 	},
			// };
			//
			// const drawControl = new L.Control.Draw(options);
			// map.addControl(drawControl);
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

	const drawnMarkerClick = (marker) => {
		const x1 = marker.getLatLng().lat;
		const x2 = marker.getLatLng().lng;
		setLocation([x1, x2]);
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
