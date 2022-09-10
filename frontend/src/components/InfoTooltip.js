import React from "react";
import successIcon from "../images/successIcon.svg";
import failIcon from "../images/failIcon.svg";

export function InfoTooltip({ isOpen, status, onClose }) {
	return (
		<div className={`popup  ${isOpen && "popup_open"}`}>
			<div className="popup__content">
				{status ? (
					<div className="popup__infoTool">
						<img
							className="popup__infoTool-image"
							src={successIcon}
							alt="success"
						/>
						<p className="popup__text">Success!You have now been registered.</p>
					</div>
				) : (
					<div className="popup__infoTool">
						<img src={failIcon} alt="fail" />
						<p className="popup__text">
							Oops! Something went wrong, please try again.
						</p>
					</div>
				)}
				<button
					className="popup__close"
					onClick={onClose}
					type="button"></button>
			</div>
		</div>
	);
}
