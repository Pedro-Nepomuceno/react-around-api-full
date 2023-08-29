import React from "react";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  onCardClick,
  handleCardDelete,
  handleCardLike,
  cards,
}) {
  const currentuserData = React.useContext(CurrentUserContext);
  console.log(currentuserData);

  return (
    <>
      <main>
        <section className="profile">
          <div className="profile__avatar">
            <div className="profile__overlay">
              <button
                type="button"
                onClick={onEditAvatarClick}
                className="profile__change-photo"
              />
            </div>
            {currentuserData.avatar && (
              <img
                className="profile__avatar-pic"
                src={currentuserData.avatar}
                alt="avatar"
              />
            )}
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{currentuserData.name}</h1>
            <p className="profile__text">{currentuserData.about}</p>

            <button
              onClick={onEditProfileClick}
              aria-label="Edit"
              type="button"
              className="profile__edit"
            />
          </div>

          <button
            onClick={onAddPlaceClick}
            aria-label="Add"
            type="button"
            className="profile__plus"
          />
        </section>
        <section className="elements">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))}
        </section>
      </main>
    </>
  );
}
export default Main;
