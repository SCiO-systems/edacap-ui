/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Slider } from 'primereact/slider';
import { Tooltip } from 'primereact/tooltip';
import './styles.css';

const DatePicker = (props) => {
	const { setTime } = props;

	const [value, setValue] = useState(274);

	const currentYear = (new Date()).getFullYear();

	useEffect(
		() => {
			const currentDate = new Date(currentYear, 0, value);
			const yyyy = currentDate.getFullYear();
			let mm = currentDate.getMonth() + 1; // Months start at 0!
			const dd = currentDate.getDate();

			let week = Math.ceil(dd / 7);
			if (week > 4) {
				week = 4;
			}

			if (mm < 10) mm = `0${mm}`;

			setTime({ year: `${yyyy}`, month: `${mm}`, week: `${dd}` });
		}, [value]
	);

	const dateFromDay = (day) => {
		const currentDate = new Date(currentYear, 0, day);
		const yyyy = currentDate.getFullYear();
		let mm = currentDate.getMonth() + 1; // Months start at 0!
		let dd = currentDate.getDate();

		if (dd < 10) dd = `0${dd}`;
		if (mm < 10) mm = `0${mm}`;

		const date = `${dd}/${mm}/${yyyy}`;
		return date;
	};

	const dateTextFromDay = (today) => {
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		const currentDate = new Date(currentYear, 0, today);
		const year = currentDate.getFullYear();
		const month = months[currentDate.getMonth()];
		const day = currentDate.getDate();
		const date = `${day} ${month} ${year}`;
		return date;
	};

	return (
		<div className="date-picker">
			<div className="header">
				<h3>{dateTextFromDay(value)}</h3>
			</div>
			<Tooltip target=".p-slider-handle" content={`${dateFromDay(value)}`} position="bottom" event="focus" />
			<Slider value={value} onChange={(e) => setValue(e.value)} min={274} max={277} autoHide={false} />
		</div>
	);
};

export default DatePicker;
