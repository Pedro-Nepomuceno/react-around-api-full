import React from "react";
import { NavLink } from "react-router-dom";

export function Login({ onSign }) {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	function handleEmailChange(e) {
		setEmail(e.target.value);
	}
	function handlePasswordChange(e) {
		setPassword(e.target.value);
	}
	function handleSubmit(e) {
		e.preventDefault();
		const userRegistration = { email, password };
		onSign(userRegistration);
	}

	return (
		<main className="form">
			<form className="form__auth" onSubmit={handleSubmit}>
				<div className="form__content">
					<h3 className="form__title">Log in</h3>
					<input
						className="form__input"
						type="text"
						autoComplete="email"
						placeholder="Email"
						required
						onChange={handleEmailChange}
					/>
					<input
						className="form__input"
						type="password"
						autoComplete="current-password"
						placeholder="Password"
						required
						onChange={handlePasswordChange}
					/>
					<button className="form__register-submit">Log in</button>
					<NavLink to="/singup" className="form__redirect">
						Not a member yet? Sign-up here
					</NavLink>
				</div>
			</form>
		</main>
	);
}
