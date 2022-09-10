import React from "react";
import PopupWithForm from "./PopupWithForm";

export function AddPlacePopup({ isOpen, onClose, onSubmit, onAddPlaceSubmit }) {
	const [name, setName] = React.useState("");
	const [link, setLink] = React.useState("");
	const [isTitleValid, setIsTitleValid] = React.useState(false);
	const [isLinkValid, setIsLinkValid] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState({
		name: "",
		link: "",
	});

	function handleLinkSubmit(e) {
		setLink(e.target.value);
		setIsLinkValid(e.target.validity.valid);
		setErrorMessage(() => ({
			link: e.target.validationMessage,
		}));
	}
	function handleTitleSubmit(e) {
		setName(e.target.value);
		setIsTitleValid(e.target.validity.valid);
		setErrorMessage(() => ({
			name: e.target.validationMessage,
		}));
	}

	function handleSubmit(e) {
		e.preventDefault();

		onAddPlaceSubmit({ name, link });
	}
	React.useEffect(() => {
		setName("");
		setLink("");
	}, [isOpen]);

	return (
		<PopupWithForm
			name="add-photo"
			title="Add New Place"
			inputName="title"
			inputDescription="URL"
			onClose={onClose}
			isOpen={isOpen}
			onSubmit={handleSubmit}
			onAddPlaceSubmit={onAddPlaceSubmit}
			disabledButton={isTitleValid && isLinkValid}>
			<input
				name="name"
				type="text"
				placeholder="Title"
				className="popup__input popup__input_type_name"
				id="name"
				required
				minLength="2"
				maxLength="40"
				value={name || ""}
				onChange={handleTitleSubmit}
			/>
			<span
				className={`popup__error ${isTitleValid ? "" : "popup__error_active"}`}
				id="name-error">
				{errorMessage.name}
			</span>
			<input
				name="about"
				type="url"
				placeholder="Place"
				className="popup__input popup__input_type_description"
				id="description"
				required
				minLength="2"
				maxLength="200"
				value={link || ""}
				onChange={handleLinkSubmit}
			/>
			<span
				className={`popup__error ${isLinkValid ? "" : "popup__error_active"}`}
				id="description-error">
				{errorMessage.link}
			</span>
		</PopupWithForm>
	);
}
