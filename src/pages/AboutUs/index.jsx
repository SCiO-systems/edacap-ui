import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from './components';
import Actions from '../../reducer/actions';
import gov from '../../assets/About/Donors/GOV_Ethiopia.svg.png';
import ida from '../../assets/About/Donors/IDA.png';
import ima from '../../assets/About/Partners/EMIlogo.jpg';
import moa from '../../assets/About/Partners/MoAlogo.jpeg';
import eiar from '../../assets/About/Team/1 EIAR_new.jpg';
import sin from '../../assets/About/Team/2 sin_fondo_ingles.png';
import cimmyt from '../../assets/About/Team/3 CIMMYT-logo-square.webp';
import iri from '../../assets/About/Team/4 IRI logo.png';
import aiccra from '../../assets/About/Team/5 AICCRA_portable.png';
import './styles.css';

const AboutUs = () => {
	const dispatch = useDispatch();

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	useEffect(
		() => {
			setCurrentPage('about');
		}, []
	);

	return (
		<div className="about">
			<div className="container p-card">
				<div className="header">
					<p>
						The Ethiopian Digital Agroclimate Advisory Platform (EDACaP) is an innovative digital
						web-platform for decision-support and learning that provides interactive demand-driven
						agroclimate information and advisory to improve crop management decisions and reduce production
						risks and enhance adaptive capacity of farmers by managing the climate risk.
					</p>
					<p>
						EDACaP incorporates a seamless seasonal climate prediction based on the NexGEN
						seasonal-to-subseasonal prediction approach, as well as crop simulation models included in
						the DSSAT package (Decision Support System for Agrotechnology Transfer). The platform&apos;s
						goal is to assist small-scale farmers, the Development Agent, extension officers, and technical
						advisors in making location and crop-specific decisions by providing real-time advisory and
						early-warning based on the interactions of various factors.
					</p>
					<p>
						The methodology was developed in partnership with the Ethiopian Institute of Agricultural
						Research (CIMMYT), the Alliance of Bioversity -CIAT, the International Maize and Wheat
						Improvement Center (CIMMYT), the International Research Institute for Climate and Society
						(IRI) in collaboration with the Ministry of Agriculture, the Ethiopian Meteorological
						Institute Accelerating Impacts of CGIAR Climate Research for Africa (AICCRA).
					</p>
				</div>
				<h2 style={{ color: '#1245ee' }}>Donors</h2>
				<div className="row p-grid">
					<Card image={gov} />
					<Card image={ida} />
				</div>
				<h2 style={{ color: '#1245ee' }}>Partners</h2>
				<div className="row p-grid">
					<Card image={ima} />
					<Card image={moa} />
				</div>
				<h2 style={{ color: '#1245ee' }}>Team</h2>
				<div className="row p-grid">
					<Card image={eiar} />
					<Card image={sin} />
					<Card image={cimmyt} />
					<Card image={iri} />
					<Card image={aiccra} />
				</div>
			</div>
		</div>
	);
};

export default AboutUs;
