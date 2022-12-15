/* eslint-disable class-methods-use-this */
import { http } from '../index';

class CountryService {
	getAdminLevels = async (level) => {
		const result = await http.get(`/api/data/ETH/high/${level}`);
		return result.data;
	};

	getAdminLevelByPoint = async (lat, lng, res, lvl) => {
		const result = await http.post(`/api/geoJsonByCoordinates`, {
			latitude: lat,
			longitude: lng,
			resolution_analysis: res,
			admin_level: lvl,
		});
		return result.data;
	};

	getAdminlevelByName = async (name) => {
		const result = await http.get(`/api/geoJsons/${name}`);
		return result.data;
	};

	getKebeleByName = async (name) => {
		const result = await http.post(`/api/geoJsons/kebele`, {
			kebele_name: name,
		});
		return result.data;
	};
}

export default new CountryService();
