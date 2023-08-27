import React from "react";
import { NavLink } from "react-router-dom";

export function Register({ onRegister }) {
  const [loginEmail, setLoginEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleEmailChange(e) {
    setLoginEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const userRegistration = { email: loginEmail, password };
    onRegister(userRegistration);
  }

  return (
    <main className="form">
      <form className="form__auth" onSubmit={handleSubmit}>
        <div className="form__content">
          <h3 className="form__title">Sign up</h3>
          <input
            className="form__input"
            type="text"
            autoComplete="username"
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
          <button className="form__register-submit">Sign-up</button>
          <NavLink to="/signin" className="form__redirect">
            Already a member? Log in here!
          </NavLink>
        </div>
      </form>
    </main>
  );
}
