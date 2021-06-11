import {Request, Response} from "express";
import {User} from "../models/user.model";
import bcrypt from "bcryptjs";
import {Role, RoleDocument} from "../models/role.model";
import jwt from 'jsonwebtoken';
import {authConfig} from "../../config/auth.config";

export const signup = (req: Request, res: Response) => {
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	});

	user.save((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}

		if(req.body.roles){
			Role.find(
				{
					name: { $in: req.body.roles }
				},
				(err, roles) => {
					if (err) {
						res.status(500).send({ message: err });
						return;
					}

					user.roles = roles.map(role => role._id);
					user.save(err => {
						if (err) {
							res.status(500).send({ message: err });
							return;
						}

						res.send({ message: "User was registered successfully!" });
					});
				}
			);
		}
		else {
			Role.findOne({ name: "user" }, (err: Error, role: RoleDocument) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}

				user.roles = [role._id];
				user.save(err => {
					if (err) {
						res.status(500).send({ message: err });
						return;
					}

					res.send({ message: "User was registered successfully!" });
				});
			});
		}
	})
}

export const signin = (req: Request, res: Response) => {
	User.findOne({
		username: req.body.username
	})
		.populate("roles", "-__v")
		.exec((err, user) => {
			if (err) {
				res.status(500).send({ message: err });
				return;
			}

			if (!user) {
				return res.status(404).send({ message: "User Not found." });
			}

			const passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Invalid Password!"
				});
			}

			const token = jwt.sign({ id: user.id }, authConfig.secret, {
				expiresIn: 86400 // 24 hours
			});

			const authorities: string[] = [];

			user.roles.forEach((role) => {
				authorities.push("ROLE_" + role.name.toUpperCase());
			})

			res.status(200).send({
				id: user._id,
				username: user.username,
				email: user.email,
				roles: authorities,
				accessToken: token
			});
		});
};