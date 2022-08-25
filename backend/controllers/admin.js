const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const { model } = require("mongoose");

const SALT_ROUNDS = 10;

const registerAdmin = (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).send({ message: `ops something went wrong` });
	}
	return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
		Admin.findOne({ email }).then((admin) => {
			if (admin) {
				return res.status(418).send({ message: `user already exist` });
			}
			return Admin.createOne({ ...req.body, password: hash })
				.then((admin) => {
					return res.status(200).send(admin);
				})
				.catch((e) => {
					res.status(500).send("sorry try again");
				});
		});
	});
};

model.exports = registerAdmin;
