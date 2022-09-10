import logo from "../images/header.svg";
import React from "react";
import { Route, Link } from "react-router-dom";

function Header({ onSignOut, email }) {
	function handleSignout() {
		onSignOut();
	}
	return (
		<header className="header">
			<img
				className="header__image"
				src={logo}
				alt="Around the United States"
			/>
			<Route exact path="/">
				<div className="header__auth-wrapper">
					<p className="header__user">{email}</p>
					<button className="header__logout" onClick={handleSignout}>
						Log out
					</button>
				</div>
			</Route>
			<Route path="/signup">
				<Link className="header__auth-link" to="signin">
					Login
				</Link>
			</Route>
			<Route path="/signin">
				<Link className="header__auth-link" to="signup">
					Sign up
				</Link>
			</Route>
		</header>
	);
}
export default Header;
