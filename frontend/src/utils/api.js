class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }
  getUserInfo(token) {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: { authorization: `Bearer ${token}`, ...this.headers },
    }).then(this._handleServerResponse);
  }

  getAppInfo(token) {
    return Promise.all([this.getInitialCards(token), this.getUserInfo(token)]);
  }
  getInitialCards(token) {
    return fetch(`${this.baseUrl}/cards`, {
      headers: { authorization: `Bearer ${token}`, ...this.headers },
    }).then(this._handleServerResponse);
  }

  _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  setUserProfile({ name, about }, token) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, ...this.headers },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleServerResponse);
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
    ? "https://api.pedronepomuceno.students.nomoredomainssbs.ru"
    : "http://localhost:3000";

const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
