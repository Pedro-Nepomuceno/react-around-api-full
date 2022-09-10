import React from "react";
import api from "../utils/api.js";
import Card from "./Card.js";

function Main({
	onEditAvatarClick,
	onEditProfileClick,
	onAddPlaceClick,
	onCardClick,
}) {
	const [userName, setUserName] = React.useState("");
	const [userDescription, setUserDescription] = React.useState("");
	const [userAvatar, setUserAvatar] = React.useState("");
	const [cards, setCards] = React.useState([]);

	React.useEffect(() => {
		api.getAppInfo().then(([cardData, userData]) => {
			setCards(cardData);
			setUserName(userData.name);
			setUserDescription(userData.about);
			setUserAvatar(userData.avatar);
		});
	}, []);
	return (
		<main>
			<section className="profile">
				<div className="profile__avatar">
					<div className="profile__overlay">
						<button
							type="button"
							onClick={onEditAvatarClick}
							className="profile__change-photo"></button>
					</div>
					<img
						className="profile__avatar-pic"
						src={userAvatar}
						alt="profile picture"
					/>
				</div>
				<div className="profile__info">
					<h1 className="profile__name">{userName}</h1>
					<p className="profile__text">{userDescription}</p>

					<button
						onClick={onEditProfileClick}
						aria-label="Edit"
						type="button"
						className="profile__edit"></button>
				</div>

				<button
					onClick={onAddPlaceClick}
					aria-label="Add"
					type="button"
					className="profile__plus"></button>
			</section>
			<section className="elements">
				{cards.map((card) => (
					<Card key={card._id} card={card} onCardClick={onCardClick} />
				))}
			</section>
		</main>
	);
}
export default Main;
