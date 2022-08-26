const { Schema, model } = require("mongoose");

const AdmSchema = new Schema({
	email: {
		type: String,
		required: true,
		minLength: 4,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
});

module.exports = moongose.model("admin", AdmSchema);
