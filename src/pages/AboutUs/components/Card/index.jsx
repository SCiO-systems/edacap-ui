import React from 'react';
import noImage from '../../../../assets/Home/noImageCard.png';
import './styles.css';

const Card = (props) => {
	const { image, title, text } = props;

	return (
		<div className="card p-card">
			{image ? <img src={image} /> : null}
			{title ? <h2>{title}</h2> : null}
			{text ? <p>{text}</p> : null}
		</div>
	);
};

export default Card;
