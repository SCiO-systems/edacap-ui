import Actions from './actions';

const initState = {
	currentPage: 'home',
	forecastSubPage: 'seasonal',
	locationLayer: { x1: 3.39882302, x2: 33.00153732, y1: 14.8454771, y2: 47.95822906 },
	weatherStations: [],
	tabLayers: [],
	seasonalLayersArray: [],
	subSeasonalLayersArray: [],
	boundsLayers: [],
	adminAreaNames: [],
	crop: '',
	cultivar: '',
	soil: '',
};

// eslint-disable-next-line default-param-last
const reducer = (currentState = initState, action) => {
	switch (action.type) {
	case Actions.SetCurrentPage:
		return {
			...currentState,
			currentPage: action.payload,
		};
	case Actions.SetForecastSubPage:
		return {
			...currentState,
			forecastSubPage: action.payload,
		};
	case Actions.SetLocationLayer:
		return {
			...currentState,
			locationLayer: action.payload,
		};
	case Actions.SetWeatherStations:
		return {
			...currentState,
			weatherStations: action.payload,
		};
	case Actions.SetTabLayers:
		return {
			...currentState,
			tabLayers: action.payload,
		};
	case Actions.SetSeasonalLayersArray:
		return {
			...currentState,
			seasonalLayersArray: action.payload,
		};
	case Actions.SetSubSeasonalLayersArray:
		return {
			...currentState,
			subSeasonalLayersArray: action.payload,
		};
	case Actions.SetBoundsLayers:
		return {
			...currentState,
			boundsLayers: action.payload,
		};
	case Actions.SetAdminAreaNames:
		return {
			...currentState,
			adminAreaNames: action.payload,
		};
	case Actions.SetCrop:
		return {
			...currentState,
			crop: action.payload,
		};
	case Actions.SetCultivar:
		return {
			...currentState,
			cultivar: action.payload,
		};
	case Actions.SetSoil:
		return {
			...currentState,
			soil: action.payload,
		};
	default: return currentState;
	}
};

export default reducer;
