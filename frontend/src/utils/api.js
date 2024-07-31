class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  // getAppInfo(token) {
  //   return Promise.all([this.getInitialCards(token), this.getUserInfo(token)]);
  // }

  async getAppInfo(token) {
    try {
      const [cardsResponse, userInfoResponse] = await Promise.all([
        this.getInitialCards(token),
        this.getUserInfo(token),
      ]);
      console.log("Initial cards response:", cardsResponse);
      console.log("User info response:", userInfoResponse);
      return [cardsResponse, userInfoResponse];
    } catch (error) {
      console.error("Error in getAppInfo:", error);
      throw error;
    }
  }

  // getAppInfo(token) {
  //   return Promise.all([
  //     this.getInitialCards(token).then((res) => {
  //       console.log("Initial cards response:", res);
  //       return res;
  //     }),
  //     this.getUserInfo(token).then((res) => {
  //       console.log("User info response:", res);
  //       return res;
  //     }),
  //   ]);
  // }

  // async getUserInfo(token) {
  //   try {
  //     const res = await fetch(`${this.baseUrl}/users/me`, {
  //       headers: { authorization: `Bearer ${token}`, ...this.headers },
  //     });
  //     return this._handleServerResponse(res);
  //   } catch (error) {
  //     console.error("Error in getUserInfo:", error);
  //     throw error;
  //   }
  // } last

  async getUserInfo(token) {
    try {
      const res = await fetch(`${this.baseUrl}/users/me`, {
        headers: { authorization: `Bearer ${token}`, ...this.headers },
      });
      console.log("User info response status:", res.status);
      const data = await this._handleServerResponse(res);
      console.log("Full user data from API:", data);
      return data;
    } catch (error) {
      console.error("Error in getUserInfo:", error);
      throw error;
    }
  }

  // async getUserInfo(token) {
  //   const res = await fetch(`${this.baseUrl}/users/me`, {
  //     headers: { authorization: `Bearer ${token}`, ...this.headers },
  //   });
  //   return this._handleServerResponse(res);
  // }

  async getInitialCards(token) {
    try {
      const res = await fetch(`${this.baseUrl}/cards`, {
        headers: { authorization: `Bearer ${token}`, ...this.headers },
      });
      console.log("Cards response status:", res.status);
      return this._handleServerResponse(res);
    } catch (error) {
      console.error("Error in getInitialCards:", error);
      throw error;
    }
  }

  // getInitialCards(token) {
  //   return fetch(`${this.baseUrl}/cards`, {
  //     headers: { authorization: `Bearer ${token}`, ...this.headers },
  //   }).then((res) => {
  //     console.log("Cards response status:", res.status);
  //     return this._handleServerResponse(res);
  //   });
  // }

  // eslint-disable-next-line class-methods-use-this
  async _handleServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    const errorData = await res.json();
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ status: res.status, ...errorData });
  }
  // _handleServerResponse(res) {
  //   if (res.ok) {
  //     return res.json();
  //   }
  //   return res.json().then((err) => Promise.reject(err));
  // }

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
