/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Ripple } from 'primereact/ripple';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../reducer/actions';

const MenuBar = (props) => {
	const { setToggleToast } = props;

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const currentPage = useSelector((state) => state.currentPage);

	const setForecastSubPage = (payload) => dispatch({ type: Actions.SetForecastSubPage, payload });

	const [registerDialog, setRegisterDialog] = useState(false);
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [crop, setCrop] = useState('');
	const [left, setLeft] = useState(null);
	const [bottom, setBottom] = useState(null);
	const [width, setWidth] = useState(0);

	useEffect(
		() => {
			let element;
			let rect;
			if (document.getElementById(currentPage)) {
				element = document.getElementById(currentPage);
				rect = element.getBoundingClientRect();
				setLeft(rect.left);
				setBottom(rect.bottom);
				setWidth(rect.right - rect.left);
			}
		}, [currentPage]
	);

	return (
		<div className="menu-bar">
			<h4 id="logo" onClick={() => navigate('/Home')}>EDACaP</h4>
			<div className="navigation-buttons">
				<div className="menu-option" role="button" tabIndex="0" onClick={() => navigate('/Home')}>
					<div role="tab" className="p-ripple" id="home">
						<p style={currentPage === 'home' ? { color: '#1245ee' } : {}}>Home</p>
						<Ripple />
					</div>
				</div>
				<div className="menu-option" role="button" tabIndex="0">
					<div role="tab" className="p-ripple" id="forecast">
						<p style={currentPage === 'forecast' ? { color: '#1245ee' } : {}}>Forecast</p>
						<Ripple />
					</div>
					<div className="sub-menu" id="mode">
						<div
							className="p-ripple"
							role="button"
							tabIndex="0"
							onClick={() => {
								setForecastSubPage('seasonal');
								navigate('/Forecast');
								document.activeElement.blur();
							}}
						>
							<p>Seasonal</p>
							<Ripple />
						</div>
						<div className="divider" />
						<div
							className="p-ripple"
							role="button"
							tabIndex="0"
							onClick={() => {
								setForecastSubPage('sub-seasonal');
								navigate('/Forecast');
								document.activeElement.blur();
							}}
						>
							<p>Sub-Seasonal</p>
							<Ripple />
						</div>
						<div className="divider" />
						<div
							className="p-ripple"
							role="button"
							tabIndex="0"
							onClick={() => {
								setForecastSubPage('weather');
								navigate('/Forecast');
								document.activeElement.blur();
							}}
						>
							<p>Weather</p>
							<Ripple />
						</div>
					</div>
				</div>
				<div
					className="menu-option"
					role="button"
					tabIndex="0"
					onClick={() => {
						setToggleToast((prev) => prev + 1);
					// navigate('/Reports')
					}}
				>
					<div role="tab" className="p-ripple" id="reports">
						<p style={currentPage === 'reports' ? { color: '#1245ee' } : {}}>Reports</p>
						<Ripple />
					</div>
				</div>
				<div className="menu-option" role="button" tabIndex="0" onClick={() => navigate('/About')}>
					<div role="tab" className="p-ripple" id="about">
						<p style={currentPage === 'about' ? { color: '#1245ee' } : {}}>About us</p>
						<Ripple />
					</div>
				</div>
				{/* <Button label="Advisory Registration" onClick={() => setRegisterDialog(true)} /> */}
				<Button label="Advisory Registration" onClick={() => setToggleToast((prev) => prev + 1)} />
			</div>
			<div className="bar" style={{ backgroundColor: '#1245ee', left, width, top: (bottom - 2), transition: 'left 0.3s' }} />
			<Dialog
				className="register"
				visible={registerDialog}
				style={{ width: '50vw' }}
				onHide={() => setRegisterDialog(false)}
				closeOnEscape
				dismissableMask
				maskStyle={{ backgroundColor: 'black' }}
			>
				<div className="register-dialog">
					<h2 style={{ marginBottom: '20px' }}>Register</h2>
					<span className="p-float-label">
						<InputText id="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="e-mail">E-mail address</label>
					</span>
					<span className="p-float-label">
						<InputText id="telephone" value={phone} onChange={(e) => setPhone(e.target.value)} />
						<label htmlFor="telephone">Telephone</label>
					</span>
					<span className="p-float-label">
						<InputText id="crop" value={crop} onChange={(e) => setCrop(e.target.value)} />
						<label htmlFor="crop">Crop</label>
					</span>
					<Button label="Register" />
					<Divider align="center">
						<b>Or</b>
					</Divider>
					<p><b>If you are already registered</b></p>
					<Button label="Log In" />
				</div>
			</Dialog>
		</div>
	);
};

export default MenuBar;
