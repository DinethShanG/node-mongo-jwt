import {User} from "../persistence/models/user.model";
import {NextFunction, Request, Response} from "express";
import {Role, RoleDocument, RoleSchema} from "../persistence/models/role.model";

const checkDuplicateUsernameOrEmail = (req: Request, res: Response, next: NextFunction) => {
	User.findOne({
		username: req.body.username
	}).exec((err, user) => {
		if (err){
			res.status(500).send({message: err})
			return;
		}
		if (user) {
			res.status(400).send({ message: "Failed! Username is already in use!" });
			return;
		}

		User.findOne({
			email: req.body.email
		}).exec((err, user) => {
			if (err) {
				res.status(500).send({message: err});
				return;
			}

			if (user) {
				res.status(400).send({message: "Failed! Email is already in use!"});
				return;
			}

			next();
		});
	});
};

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
	if(req.body.roles){
		req.body.roles.forEach((role: RoleDocument) => {
			if(!Role.findOne({name: role.name})){
					res.status(400).send({
						message: `Failed! Role ${role.name} does not exist!`
					})
				return
			}
		})
	}
	next();
};

export const verifySignUp = {
	checkDuplicateUsernameOrEmail,
	checkRolesExisted
}
