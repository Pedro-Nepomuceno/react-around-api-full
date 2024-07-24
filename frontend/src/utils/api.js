class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async getUserInfo(token) {
    const res = await fetch(`${this.baseUrl}/users/me`, {
      headers: { authorization: `Bearer ${token}`, ...this.headers },
    });
    return this._handleServerResponse(res);
  }

  // getAppInfo(token) {
  //   return Promise.all([this.getInitialCards(token), this.getUserInfo(token)]);
  // }

  getAppInfo(token) {
    return Promise.all([
      this.getInitialCards(token).then((res) => {
        console.log("Initial cards response:", res);
        return res;
      }),
      this.getUserInfo(token).then((res) => {
        console.log("User info response:", res);
        return res;
      }),
    ]);
  }

  // getInitialCards(token) {
  //   return fetch(`${this.baseUrl}/cards`, {
  //     headers: { authorization: `Bearer ${token}`, ...this.headers },
  //   }).then(this._handleServerResponse);
  // }

  getInitialCards(token) {
    return fetch(`${this.baseUrl}/cards`, {
      headers: { authorization: `Bearer ${token}`, ...this.headers },
    }).then((res) => {
      console.log("Cards response status:", res.status);
      return this._handleServerResponse(res);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _handleServerResponse(res) {
    return res.ok
      ? res.json()
      : Promise.reject(new Error(`Error: ${res.status}`));
  }

  async setUserProfile({ name, about }, token) {
    const res = await fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, ...this.headers },
      body: JSON.stringify({
        name,
        about,
      }),
    });
    return this._handleServerResponse(res);
  }

  addNewCard({ name, link }, token) {
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, ...this.headers },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleServerResponse);
  }

  deleteCard(id, token) {
    return fetch(`${this.baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}`, ...this.headers },
    }).then(this._handleServerResponse);
  }

  handleLikePhoto(id, like, token) {
    return fetch(`${this.baseUrl}/cards/${id}/likes`, {
      method: like ? "DELETE" : "PUT",
      headers: { authorization: `Bearer ${token}`, ...this.headers },
    }).then(this._handleServerResponse);
  }

  editProfilePic({ avatar }, token) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, ...this.headers },
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleServerResponse);
  }
}

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mysubdomain.apiaroundreact.net"
    : "http://localhost:4000";

const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    referrer: "unsafe-url",
  },
});
export default api;
