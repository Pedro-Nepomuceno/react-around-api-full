import React from "react";
function ImagePopup({ card, onClose }) {
	return (
		<div className={`popup ${card ? "popup_open" : ""}`} id="photo">
			<div className="popup__content popup__content_type_image">
				<button
					className="popup__close"
					type="button"
					onClick={onClose}></button>

				<img
					className="popup__image"
					src={card ? card.link : ""}
					alt={card ? card.name : ""}
				/>

				<p className="popup__caption">{card ? card.name : ""}</p>
			</div>
		</div>
	);
}
export default ImagePopup;
