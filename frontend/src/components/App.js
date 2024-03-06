import React, { useState } from "react";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api";
import auth from "../utils/auth.js";
import { Register } from "./Register.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import { Login } from "./Login";
import { InfoTooltip } from "./InfoTooltip";

function App() {
  const [cards, setCards] = React.useState([]);
  const [isEditAvatarPopupOpen, setIsAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState([]);
  const [infoToolTip, setInfoToolTip] = useState(false);
  const [loggedIn, setIsLogged] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [status, setStatus] = useState(false);

  const history = useHistory();

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && loggedIn) {
      api
        .getAppInfo(token)
        .then(async ([CardData, userData]) => {
          const data = await CardData.json();
          const userInfo = await userData.json();
          console.log(data);
          setCurrentUser(userInfo);
          setCards(data);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn, handleAddPlaceSubmit]);

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then(async (res) => {
          const data = await res.json();
          if (res) {
            setSignUpEmail(data.email);
            setIsLogged(true);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleClosePopup() {
    setSelectedCard(false);
    setIsAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setInfoToolTip(false);
  }
  function handleUpdateUser(user) {
    api
      .setUserProfile(user, localStorage.getItem("jwt"))
      .then((data) => {
        setCurrentUser(data);
        setEditProfilePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateAvatar(userPicture) {
    api
      .editProfilePic(userPicture, localStorage.getItem("jwt"))
      .then(async (data) => {
        const profilePicture = await data.json();
        console.log("Profile picture:", profilePicture);
        setCurrentUser(profilePicture.data);
        setIsAvatarPopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id, localStorage.getItem("jwt"))
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user === currentUser._id);

    api
      .handleLikePhoto(card._id, isLiked, localStorage.getItem("jwt"))
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addNewCard(newCard, localStorage.getItem("jwt"))
      .then((data) => {
        setCards([data, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function onRegister({ email, password }) {
    auth
      .register({ email, password })
      .then(async (res) => {
        const data = await res.json();
        if (data._id) {
          setInfoToolTip(true);
          setStatus(true);
          history.push("/signin");
        } else {
          setInfoToolTip(true);
          setStatus(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setInfoToolTip(true);
        setStatus(false);
      });
  }

  function onLogin({ email: loginEmail, password }) {
    auth
      .login({ email: loginEmail, password })
      .then(async (res) => {
        const data = await res.json();
        if (data.token) {
          setSignUpEmail(loginEmail);
          setIsLogged(true);
          localStorage.setItem("jwt", data.token);
          history.push("/");
        } else {
          setInfoToolTip(true);
          setStatus(false);
        }
      })
      .catch(() => {
        setInfoToolTip(true);
        setStatus(false);
      });
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setInfoToolTip(false);
    history.push("/signin");
  }

  return (
    <>
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header onSignOut={onSignOut} email={signUpEmail} />
          <Switch>
            <ProtectedRoute exact path="/" loggedIn={loggedIn}>
              <Main
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onCardClick={handleCardClick}
                handleCardDelete={handleCardDelete}
                handleCardLike={handleCardLike}
                cards={cards}
              />
            </ProtectedRoute>
            <Route path="/signup">
              <Register onRegister={onRegister} />
            </Route>
            <Route path="/signin">
              <Login onSign={onLogin} />
            </Route>
            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>
          <InfoTooltip
            isOpen={infoToolTip}
            status={status}
            onClose={handleClosePopup}
          />
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={handleClosePopup}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={handleClosePopup}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={handleClosePopup}
            onAddPlaceSubmit={handleAddPlaceSubmit}
          />

          <ImagePopup card={selectedCard} onClose={handleClosePopup} />
        </CurrentUserContext.Provider>
      </div>
    </>
  );
}

export default App;
