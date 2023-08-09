import React from "react";

export function PopupWithForm({
  title,
  name,
  isOpen,
  onClose,
  buttonText = "save",
  children,
  onSubmit,
  disabledButton,
}) {
  return (
    <div
      className={`popup popup_type_${name} ${isOpen && "popup_open"} `}
      id="edit-popup"
    >
      <div className="popup__content">
        <button
          className="popup__close"
          onClick={onClose}
          type="button"
        ></button>
        <h3 className="popup__title">{title}</h3>
        <form
          onSubmit={onSubmit}
          className="popup__form"
          name={name}
          noValidate
        >
          {children}
          <button
            type="submit"
            className={`popup__submit ${
              disabledButton ? "" : "popup__submit_disabled"
            } `}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
