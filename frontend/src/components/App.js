import React, { useState } from "react";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api.js";
import auth from "../utils/auth.js";
import { Register } from "./Register.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { EditProfilePopup } from "./EditProfilePopup.js";
import { EditAvatarPopup } from "./EditAvatarPopup.js";
import { AddPlacePopup } from "./AddPlacePopup.js";
import ProtectedRoute from "./ProtectedRoute.js";
import { Login } from "./Login.js";
import { InfoTooltip } from "./InfoTooltip.js";

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
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  function getLikeUserId(user) {
    return typeof user === "string" ? user : user && user._id;
  }

  function handleAddPlaceSubmit(newCard) {
    api.addNewCard(newCard).then((data) => {
      setCards([data, ...cards]);
      setIsAddPlacePopupOpen(false);
    });
  }
  React.useEffect(() => {
    setIsLoading(true);

    auth
      .checkToken()
      .then((userData) => {
        if (userData && userData._id) {
          setIsLogged(true);
          setCurrentUser(userData);
          setSignUpEmail(userData.email);
        } else {
          setIsLogged(false);
        }
      })
      .catch(() => {
        setIsLogged(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    if (!loggedIn) {
      return;
    }

    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        if (userData && userData._id) {
          setCurrentUser(userData);
          setSignUpEmail(userData.email);
        }
        setCards(cardData);
      })
      .catch(() => {
        setCards([]);
      });
  }, [loggedIn]);

  // React.useEffect(() => {
  //   const token = localStorage.getItem("jwt");

  //   if (token && loggedIn) {
  //     api.getAppInfo(token).then(async ([CardData, userData]) => {
  //       const data = await CardData;
  //       const userInfo = await userData;

  //       if (userInfo && userInfo._id) {
  //         setCurrentUser(userInfo);
  //         setCards(data);
  //       }
  //     });
  //   }
  // }, [loggedIn]);

  // React.useEffect(() => {
  //   const token = localStorage.getItem("jwt");
  //   if (token) {
  //     setIsLoading(true);
  //     auth
  //       .checkToken(token)
  //       .then((tokenData) => {
  //         if (tokenData && tokenData._id) {
  //           setIsLogged(true);
  //           return auth.getUserById(tokenData._id, token);
  //         }
  //         throw new Error("Invalid token data");
  //       })
  //       .then((fullUserData) => {
  //         setSignUpEmail(fullUserData.email);
  //         setCurrentUser(fullUserData);
  //         return api.getInitialCards(token);
  //       })
  //       .then((cardData) => {
  //         setCards(cardData);
  //       })
  //       .catch(() => {
  //         setIsLogged(false);
  //         localStorage.removeItem("jwt");
  //       })
  //       .finally(() => setIsLoading(false));
  //   } else {
  //     setIsLogged(false);
  //     setIsLoading(false);
  //   }
  // }, []);

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
    api.setUserProfile(user).then((data) => {
      setCurrentUser(data);
      setEditProfilePopupOpen(false);
    });
  }
  function handleUpdateAvatar(userPicture) {
    api.editProfilePic(userPicture).then(async (data) => {
      const profilePicture = await data;
      setCurrentUser(profilePicture);
      setIsAvatarPopupOpen(false);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== card._id),
      );
    });
  }

  function handleCardLike(card) {
    const likes = Array.isArray(card.likes) ? card.likes : [];
    const currentUserId = currentUser && currentUser._id;
    const isLiked = likes.some((user) => getLikeUserId(user) === currentUserId);

    api.handleLikePhoto(card._id, isLiked).then((newCard) => {
      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === card._id ? newCard : currentCard,
        ),
      );
    });
  }

  async function onRegister({ email, password }) {
    try {
      const res = await auth.register({ email, password });
      if (res && res._id) {
        setInfoToolTip(true);
        setStatus(true);
        history.push("/signin");
      } else {
        setInfoToolTip(true);
        setStatus(false);
      }
    } catch (err) {
      setInfoToolTip(true);
      setStatus(false);
    }
  }
  async function onLogin({ email, password }) {
    try {
      const data = await auth.login({ email, password });

      if (data && data._id) {
        setSignUpEmail(data.email);
        setCurrentUser(data);
        setIsLogged(true);
        history.push("/");
      } else {
        setInfoToolTip(true);
        setStatus(false);
      }
    } catch (err) {
      setInfoToolTip(true);
      setStatus(false);
    }
  }

  // async function onLogin({ email, password }) {
  //   try {
  //     const data = await auth.login({ email, password });
  //     if (data.token) {
  //       setSignUpEmail(email);
  //       setIsLogged(true);
  //       localStorage.setItem("jwt", data.token);
  //       setCurrentUser(data);
  //       history.push("/");
  //     } else {
  //       setInfoToolTip(true);
  //       setStatus(false);
  //     }
  //   } catch (err) {
  //     setInfoToolTip(true);
  //     setStatus(false);
  //   }
  // }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setInfoToolTip(false);
    history.push("/signin");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
  );
}

export default App;
