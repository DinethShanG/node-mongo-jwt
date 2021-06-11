import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {authConfig} from "../config/auth.config";
import {User} from "../persistence/models/user.model";
import {Role} from "../persistence/models/role.model";


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token= <string>req.headers["x-access-token"]

	if(!token){
		return res.status(403).send({ message: "No token provided!" });
	}

	jwt.verify(token, authConfig.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: "Unauthorized!" });
		}
		(<any>req).userId = (<any>decoded).id;
		next();
	});
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	User.findById((<any>req).userId).exec((err, user) => {
		if(err){
			res.status(500).send({message: err})
			return
		}
		if(user){
			Role.find(
				{
					_id: {$in: user.roles}
				},
				(err, roles) => {
					if(err){
						res.status(500).send({ message: err });
						return;
					}
					user.roles.forEach((role) => {
						if(role.name === "admin"){
							next();
							return
						}
					})
					res.status(403).send({ message: "Require Admin Role!" });
					return;
				}
			)
		}

	})
}

const isModerator = (req: Request, res: Response, next: NextFunction) => {
	User.findById((<any>req).userId).exec((err, user) => {
		if(err){
			res.status(500).send({message: err})
			return
		}
		if(user){
			Role.find(
				{
					_id: {$in: user.roles}
				},
				(err, roles) => {
					if(err){
						res.status(500).send({ message: err });
						return;
					}
					user.roles.forEach((role) => {
						if(role.name === "moderator"){
							next();
							return
						}
					})
					res.status(403).send({ message: "Require moderator Role!" });
					return;
				}
			)
		}

	})
}

export const authJwt = {
	verifyToken,
	isAdmin,
	isModerator
};