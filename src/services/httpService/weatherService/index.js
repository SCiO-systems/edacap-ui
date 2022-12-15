/* eslint-disable class-methods-use-this */
import { http } from '../index';

class WeatherService {
	getStatisticsCalculation = async (layers, geo_json, admin_level, admin_level_id) => {
		const result = await http.post(`/api/statisticsCalculation`, {
			layers,
			geo_json,
			admin_level,
			admin_level_id,
		});
		return result.data;
	};

	getWeatherVariables = async (lat, lng) => {
		const result = await http.get(`/api/forecast/weather/${lat}/${lng}`);
		return result.data;
	};
}

export default new WeatherService();
