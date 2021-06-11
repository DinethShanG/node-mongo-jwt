import {Express, NextFunction, Request, Response} from "express";
import {adminBoard, allAccess, moderatorBoard, userBoard} from "../persistence/controllers/user.controllers";
import {authJwt} from "../middleware/authJwt";

export const userRoutes = function(app: Express) {
	app.use(function(req: Request, res: Response, next: NextFunction) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.get("/api/test/all", allAccess);

	app.get("/api/test/user", [authJwt.verifyToken], userBoard);

	app.get(
		"/api/test/mod",
		[authJwt.verifyToken, authJwt.isModerator],
		moderatorBoard
	);

	app.get(
		"/api/test/admin",
		[authJwt.verifyToken, authJwt.isAdmin],
		adminBoard
	);
};