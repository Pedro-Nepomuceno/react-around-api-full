import "../App.css";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./popupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import React, { useState } from "react";

function App() {
	const [isEditAvatarPopupOpen, setIsAvatarPopupOpen] = React.useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
	const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
		React.useState(false);
	const [selectedCard, setSelectedCard] = React.useState(null);

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
	}

	return (
		<div className="page">
			<Header />
			<Main
				onEditAvatarClick={handleEditAvatarClick}
				onEditProfileClick={handleEditProfileClick}
				onAddPlaceClick={handleAddPlaceClick}
				onCardClick={handleCardClick}
			/>
			<Footer />

			<PopupWithForm
				name="edit-popup"
				title="Edit Profile"
				inputName="Name"
				inputDescription="About me"
				onClose={handleClosePopup}
				isOpen={isEditProfilePopupOpen}>
				<input
					name="name"
					type="text"
					placeholder="name"
					className="popup__input popup__input_type_name"
					id="name"
					required
					minLength="2"
					maxLength="40"
				/>
				<span className="popup__error" id="name-error"></span>
				<input
					name="about"
					type="text"
					placeholder="Description"
					className="popup__input popup__input_type_description"
					id="description"
					required
					minLength="2"
					maxLength="200"
				/>
				<span className="popup__error" id="description-error"></span>
			</PopupWithForm>

			<PopupWithForm
				name="add-photo"
				title="Add New Place"
				inputName="title"
				inputDescription="URL"
				onClose={handleClosePopup}
				isOpen={isAddPlacePopupOpen}>
				<input
					name="name"
					type="text"
					placeholder="Title"
					className="popup__input popup__input_type_name"
					id="name"
					required
					minLength="2"
					maxLength="40"
				/>
				<span className="popup__error" id="name-error"></span>
				<input
					name="about"
					type="url"
					placeholder="Place"
					className="popup__input popup__input_type_description"
					id="description"
					required
					minLength="2"
					maxLength="200"
				/>
				<span className="popup__error" id="description-error"></span>
			</PopupWithForm>
			<PopupWithForm
				name="edit-popupPicture"
				title="Change Profile Picture"
				onClose={handleClosePopup}
				isOpen={isEditAvatarPopupOpen}>
				<input
					name="avatar"
					type="url"
					placeholder="Link"
					className="popup__input popup__input_type_name"
					id="avatar"
					required
					minLength="6"
				/>
				<span className="popup__error" id="avatar-error"></span>
			</PopupWithForm>
			<ImagePopup card={selectedCard} onClose={handleClosePopup} />

			<div className="popup" id="delete-popup">
				<div className="popup__content popup__content_type_delete">
					<button className="popup__close" type="button"></button>
					<h3 className="popup__title">Are you sure?</h3>

					<button
						type="submit"
						className="popup__submit popup__submit_type_delete">
						Yes
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
