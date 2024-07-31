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

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token && loggedIn) {
      api
        .getAppInfo(token)
        .then(async ([CardData, userData]) => {
          console.log("Token being sent:", localStorage.getItem("jwt"));

          console.log("Raw CardData:", CardData);
          console.log("Raw userData:", userData);

          const data = await CardData;
          const userInfo = await userData;

          console.log("Parsed card data:", data);
          console.log("Parsed user info:", userInfo);

          if (userInfo && userInfo._id) {
            setCurrentUser(userInfo);
            setCards(data);
          } else {
            console.error("Invalid user data received:", userInfo);
            // Handle the error appropriately (e.g., log out the user, show an error message)
          }
        })
        .catch((err) => {
          console.error("Error fetching app info:", err);
          // Handle the error appropriately
        });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoading(true);
      auth
        .checkToken(token)
        .then((tokenData) => {
          if (tokenData && tokenData._id) {
            setIsLogged(true);
            return auth.getUserById(tokenData._id, token);
          }
          throw new Error("Invalid token data");
        })
        .then((fullUserData) => {
          console.log("Full user data on refresh:", fullUserData);
          setSignUpEmail(fullUserData.email);
          setCurrentUser(fullUserData);
          return api.getInitialCards(token);
        })
        .then((cardData) => {
          setCards(cardData);
        })
        .catch((err) => {
          console.error("Error checking token or fetching data:", err);
          setIsLogged(false);
          localStorage.removeItem("jwt");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLogged(false);
      setIsLoading(false);
    }
  }, []);

  // React.useEffect(() => {
  //   const token = localStorage.getItem("jwt");
  //   console.log("Token from localStorage:", token);
  //   if (token) {
  //     setIsLoading(true);
  //     auth
  //       .checkToken(token)
  //       .then((userData) => {
  //         console.log("User data:", userData);
  //         if (userData && userData._id) {
  //           setSignUpEmail(userData.email);
  //           setIsLogged(true);
  //           setCurrentUser(userData);
  //         } else {
  //           throw new Error("Invalid user data");
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("Error checking token:", err);
  //         setIsLogged(false);
  //         localStorage.removeItem("jwt");
  //       })
  //       .finally(() => setIsLoading(false));
  //   } else {
  //     setIsLogged(false);
  //     setIsLoading(false);
  //   }
  // }, []);

  // React.useEffect(() => {
  //   const token = localStorage.getItem("jwt");
  //   if (token && loggedIn) {
  //     api
  //       .getAppInfo(token)
  //       .then(async ([CardData, userData]) => {
  //         const data = await CardData.json();
  //         const userInfo = await userData.json();
  //         setCurrentUser(userInfo);
  //         setCards(data);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [loggedIn]);

  // currentUser, cards;

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
        console.log("Updated user data:", data);

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
        const profilePicture = await data;
        console.log("Profile picture:", profilePicture);
        setCurrentUser(profilePicture);
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
    console.log(isLiked);

    api
      .handleLikePhoto(card._id, isLiked, localStorage.getItem("jwt"))
      .then((newCard) => {
        console.log(`newCard:${newCard}`);
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

  async function onRegister({ email, password }) {
    try {
      const res = await auth.register({ email, password });
      console.log("Response data after onRegister hit:", res);
      if (res && res._id) {
        // Check if data exists and has _id property
        setInfoToolTip(true);
        setStatus(true);
        history.push("/signin");
      } else {
        setInfoToolTip(true);
        setStatus(false);
      }
    } catch (err) {
      console.error("Error occurred during registration:", err);
      setInfoToolTip(true);
      setStatus(false);
    }
  }

  // function onRegister({ email, password }) {
  //   auth
  //     .register({ email, password })
  //     .then((res) => {
  //       console.log(res);
  //       console.log("res status", res.status);
  //       const data = res.json();
  //       console.log("data", data);
  //       if (data._id) {
  //         setInfoToolTip(true);
  //         setStatus(true);
  //         history.push("/signin");
  //       } else {
  //         setInfoToolTip(true);
  //         setStatus(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setInfoToolTip(true);
  //       setStatus(false);
  //     });
  // }

  async function onLogin({ email, password }) {
    try {
      const data = await auth.login({ email, password });
      console.log("Login response:", data);
      if (data.token) {
        setSignUpEmail(email);
        setIsLogged(true);
        localStorage.setItem("jwt", data.token);
        setCurrentUser(data);
        history.push("/");
      } else {
        setInfoToolTip(true);
        setStatus(false);
      }
    } catch (err) {
      console.error("Error occurred during login:", err);
      setInfoToolTip(true);
      setStatus(false);
    }
  }

  // function onLogin({ email: loginEmail, password }) {
  //   auth
  //     .login({ email: loginEmail, password })
  //     .then(async (res) => {
  //       console.log(`this is the data after onLogin hit ${res}`);
  //       const data = await res.json();
  //       console.log(
  //         `this is the onLogin data response after being parsed to json ${data}`
  //       );
  //       if (data.token) {
  //         setSignUpEmail(loginEmail);
  //         setIsLogged(true);
  //         localStorage.setItem("jwt", data.token);
  //         history.push("/");
  //       } else {
  //         setInfoToolTip(true);
  //         setStatus(false);
  //       }
  //     })
  //     .catch(() => {
  //       setInfoToolTip(true);
  //       setStatus(false);
  //     });
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
