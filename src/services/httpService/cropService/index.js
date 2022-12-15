/* eslint-disable class-methods-use-this */
import { http } from '../index';

class CropService {
	getCropCultivarAndSoilVocabularies = async () => {
		const result = await http.get(`/api/crops/info`);
		return result.data;
	};

	getYield = async (weatherStationID, soilID, cultivarID) => {
		const result = await http.get(`/api/crops/yieldForecast/fetch/${weatherStationID}/${soilID}/${cultivarID}`);
		return result.data;
	};

	getRange = async (weatherStationId, cropId) => {
		const result = await http.get(`/api/crops/yieldForecast/fetch/${weatherStationId}/ranges/${cropId}`);
		return result.data;
	};
}

export default new CropService();
