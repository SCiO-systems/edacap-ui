/* eslint-disable no-underscore-dangle,max-len */
import L from 'leaflet';

L.SingleTileSubSeasonal = L.ImageOverlay.extend({
	defaultWmsParams(options) {
		return {
			service: 'WMS',
			request: 'GetMap',
			version: '1.1.0',
			styles: '',
			format: 'image/png',
			transparent: true,
			bbox: options.bbox,
			width: options.width,
			height: options.height,
			layers: options.layers,
			time: options.time,
		};
	},

	initialize(url, bounds, options) {
		this.wmsParams = L.extend({}, this.defaultWmsParams(options));
		L.ImageOverlay.prototype.initialize.call(this, url, bounds, options);
	},

	setParams(params) {
		L.extend(this.wmsParams, params);
		return this;
	},

	redraw() {
		this._updateImageUrl();
	},

	onAdd(map) {
		const projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs';
		//		this.wmsParams[projectionKey] = 'EPSG:4326'; // this is incorrect!
		this.wmsParams[projectionKey] = 'EPSG:4326';
		L.ImageOverlay.prototype.onAdd.call(this, map);
		map.on('moveend', this._updateImageUrl, this);
	},

	onRemove(map) {
		map.on('moveend', this._updateImageUrl, this);
		L.ImageOverlay.prototype.onRemove.call(this, map);
	},

	// Copypasted from L.ImageOverlay (dirty hack)
	_initImage() {
		this._image = L.DomUtil.create('img', 'leaflet-image-layer');

		if (this._map.options.zoomAnimation && L.Browser.any3d) {
			L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
		} else {
			L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
		}

		this._updateOpacity();
		// this._bounds = L.latLngBounds(L.latLng(36, 11), L.latLng(38, 12));

		// TODO createImage util method to remove duplication
		L.extend(this._image, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: L.bind(this._onImageLoad, this),
			src: this._constructUrl(),
		});
	},

	_onImageLoad() {
		// this._bounds = L.latLngBounds(L.latLng(36, 11), L.latLng(38, 12));
		this._reset();
		this.fire('load');
	},

	_updateImageUrl() {
		this._image.src = this._constructUrl();
	},

	_constructUrl() {
		return `${this._url + L.Util.getParamString(this.wmsParams, this._url)}`;
	},
});

L.singleTileSubSeasonal = function (url, bounds, options) {
	return new L.SingleTileSubSeasonal(url, bounds, options);
};
