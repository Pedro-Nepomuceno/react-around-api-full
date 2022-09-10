import React from "react";

export function Card({ card, onCardClick }) {
	function handleCardClick() {
		onCardClick(card);
	}
	return (
		<div className="elements__photo">
			<img
				className="elements__pic"
				onClick={handleCardClick}
				src={card.link}
				alt={card.name}
			/>
			<button type="reset" className="elements__delete"></button>
			<div className="elements__info">
				<h2 className="elements__info-text">{card.name}</h2>
				<div className="elements__like">
					<button type="button" className="elements__info-button"></button>
					<p className="elements__counter">{card.likes.length}</p>
				</div>
			</div>
		</div>
	);
}
export default Card;
