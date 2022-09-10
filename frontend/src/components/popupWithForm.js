function PopupWithForm({
	title,
	name,
	isOpen,
	onClose,
	buttonText = "save",
	children,
}) {
	return (
		<div
			className={`popup popup_type_${name} ${isOpen ? "popup_open" : ""} `}
			id="edit-popup">
			<div className="popup__content">
				<button
					className="popup__close"
					onClick={onClose}
					type="button"></button>
				<h3 className="popup__title">{title}</h3>
				<form id="profile-form" className="popup__form" name={name} noValidate>
					{children}
					<button type="submit" className="popup__submit" disabled>
						{buttonText}
					</button>
				</form>
			</div>
		</div>
	);
}
export default PopupWithForm;
