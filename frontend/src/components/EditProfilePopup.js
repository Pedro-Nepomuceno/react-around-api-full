import React from "react";
import { PopupWithForm } from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isNameValid, setNameValid] = React.useState(false);
  const [isDescriptionValid, setDescriptionValid] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState({
    name: "",
    description: "",
  });

  const currentUser = React.useContext(CurrentUserContext);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name,
      about: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  function handleNameChange(e) {
    setName(e.target.value);
    setNameValid(e.target.validity.valid);
    setErrorMessage(() => ({
      name: e.target.validationMessage,
    }));
  }
  function handleDescriptionChange(e) {
    setDescription(e.target.value);
    setDescriptionValid(e.target.validity.valid);
    setErrorMessage(() => ({
      description: e.target.validationMessage,
    }));
  }
  return (
    <PopupWithForm
      name="edit-popup"
      title="Edit Profile"
      inputName="Name"
      inputDescription="About me"
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      disabledButton={isDescriptionValid && isNameValid}
    >
      <input
        name="name"
        type="text"
        placeholder="name"
        className="popup__input popup__input_type_name"
        required
        minLength="2"
        maxLength="40"
        value={name || ""}
        onChange={handleNameChange}
      />
      <span
        className={`popup__error ${isNameValid ? "" : " popup__error_active"}`}
        id="name-error"
      >
        {errorMessage.name}
      </span>
      <input
        name="about"
        type="text"
        placeholder="Description"
        className="popup__input popup__input_type_description"
        required
        minLength="2"
        maxLength="200"
        value={description || ""}
        onChange={handleDescriptionChange}
      />
      <span
        className={`popup__error ${
          isDescriptionValid ? "" : "popup__error_active"
        }`}
        id="description-error"
      >
        {errorMessage.description}
      </span>
    </PopupWithForm>
  );
}
