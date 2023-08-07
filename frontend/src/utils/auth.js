class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  static _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  register({ email, password }) {
    return fetch(`${this.baseUrl}/signup`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(this._handleServerResponse);
  }

  login({ email, password }) {
    return fetch(`${this.baseUrl}/signin`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ password, email }),
    }).then(this._handleServerResponse);
  }

  checkToken(token) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleServerResponse);
  }
}

// const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://api.pedronepomuceno.students.nomoredomainssbs.ru"
//     : "http://localhost:3000";

const BASE_URL = "http://localhost:3000";

const auth = new Auth({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default auth;
