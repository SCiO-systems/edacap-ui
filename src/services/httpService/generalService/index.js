/* eslint-disable class-methods-use-this */
import { http } from '../index';

class GeneralService {
	getTabLayers = async () => {
		const result = await http.get(`/api/layers/data`);
		return result.data;
	};
}

export default new GeneralService();
