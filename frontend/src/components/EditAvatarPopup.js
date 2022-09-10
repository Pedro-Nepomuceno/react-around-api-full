import React from "react";
import PopupWithForm from "./PopupWithForm";

export function EditAvatarPopup({ onClose, isOpen, onUpdateAvatar }) {
	const dataLink = React.useRef();
	const [isAvatarValid, setAvatarValid] = React.useState();
	const [errorMessage, setErrorMessage] = React.useState("");
	function handleSubmit(e) {
		e.preventDefault();

		onUpdateAvatar({
			avatar: dataLink.current.value,
		});
	}
	function handleChange(e) {
		setAvatarValid(e.target.validity.valid);
		setErrorMessage(e.target.validationMessage);
	}
	React.useEffect(() => {
		dataLink.current.value = "";
	}, [isOpen]);

	return (
		<PopupWithForm
			name="edit-popupPicture"
			title="Change Profile Picture"
			onClose={onClose}
			isOpen={isOpen}
			onSubmit={handleSubmit}>
			<input
				name="avatar"
				type="url"
				placeholder="Link"
				className="popup__input popup__input_type_name"
				id="avatar"
				required
				minLength="6"
				ref={dataLink}
				onChange={handleChange}
			/>
			<span
				className={`popup__error ${
					isAvatarValid ? "" : " popup__error_active"
				}`}
				id="avatar-error">
				{errorMessage}
			</span>
		</PopupWithForm>
	);
}
