class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this._handleServerResponse = this._handleServerResponse.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  _handleServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  }

  register({ email, password }) {
    return fetch(`${this.baseUrl}/signup`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        email: String(email),
        password: String(password),
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

  getUserById(userId, token) {
    return fetch(`${this.baseUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleServerResponse);
  }

  checkToken(token) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(`Error: ${res.status}`);
    });
  }
}

//   async checkToken(token) {
//     const res = await fetch(`${this.baseUrl}/users/me`, {
//       method: "GET",
//       headers: {
//         ...this.headers,
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return this._handleServerResponse(res);
//   }
//

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mysubdomain.apiaroundreact.net"
    : "http://localhost:4000";

const auth = new Auth({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    //    referrer: "unsafe-url",
  },
});

export default auth;
