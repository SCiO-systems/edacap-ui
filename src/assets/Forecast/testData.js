const data = {
	type: 'Feature',
	geometry: {
		type: 'Point',
		coordinates: [8.428438, 39.388445, 25],
	},
	properties: {
		meta: {
			units: {
				air_pressure_at_sea_level: 'hPa',
				air_temperature: 'celsius',
				cloud_area_fraction: '%',
				// precipitation_amount: 'mm',
				relative_humidity: '%',
				wind_from_direction: 'degrees',
				wind_speed: 'm/s',
				low_temp: 'C',
			},
		},
		timeseries: [
			{
				time: '2022-11-18T13:00:00Z',
				data: {
					instant: {
						details: {
							air_pressure_at_sea_level: Math.floor(Math.random() * 1001),
							air_temperature: Math.floor(Math.random() * 30),
							cloud_area_fraction: Math.floor(Math.random() * 100),
							relative_humidity: 68.8,
							wind_from_direction: 279.1,
							wind_speed: 5.6,
							low_temp: Math.floor(Math.random() * 10),
						},
						symbol_code: 'partlycloudy_day',
					},
				},
			},
			{
				time: '2022-11-19T13:00:00Z',
				data: {
					instant: {
						details: {
							air_pressure_at_sea_level: Math.floor(Math.random() * 1001),
							air_temperature: Math.floor(Math.random() * 30),
							cloud_area_fraction: Math.floor(Math.random() * 100),
							relative_humidity: 68.8,
							wind_from_direction: 279.1,
							wind_speed: 5.6,
							low_temp: Math.floor(Math.random() * 10),
						},
						symbol_code: 'partlycloudy_day',
					},
				},
			},
			{
				time: '2022-11-20T13:00:00Z',
				data: {
					instant: {
						details: {
							air_pressure_at_sea_level: Math.floor(Math.random() * 1001),
							air_temperature: Math.floor(Math.random() * 30),
							cloud_area_fraction: Math.floor(Math.random() * 100),
							relative_humidity: 68.8,
							wind_from_direction: 279.1,
							wind_speed: 5.6,
							low_temp: Math.floor(Math.random() * 10),
						},
						symbol_code: 'fair_night',
					},
				},
			},
		],
	},
};

export default data;
