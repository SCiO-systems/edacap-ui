/* eslint-disable class-methods-use-this */
import { http } from '../index';

class StationsService {
	getWeatherStationsByBbox = async (x1, x2, y1, y2) => {
		const result = await http.post(`/api/data/weatherStations`, {
			action: 'search',
			details: {
				bounding_box: {
					bottom_left_lat: x1,
					bottom_left_lon: x2,
					top_right_lat: y1,
					top_right_lon: y2,
				},
			},
		});
		return result.data;
	};

	getWeatherStationData = async (id, year, semester) => {
		const result = await http.get(`/api/forecast/climate/${id}/${semester}`);
		return result.data;
	};

	getWeatherStationHistoricalData = async (id) => {
		const result = await http.get(`/api/historical/climatology/${id}`);
		return result.data;
	};
}

export default new StationsService();
