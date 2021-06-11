import {verifySignUp} from "../middleware/verifySignUp";
import {signin, signup} from "../persistence/controllers/auth.controller";
import {Express, NextFunction, Request, Response} from "express";

export const authRoutes = (app: Express) => {
	app.use((req: Request, res: Response, next: NextFunction) => {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	app.post(
		"/api/auth/signup",
		[
			verifySignUp.checkDuplicateUsernameOrEmail,
			verifySignUp.checkRolesExisted
		],
		signup
	);

	app.post("/api/auth/signin", signin);
};