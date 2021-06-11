import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./persistence/connection";
import {dbConfig} from './config/db.config';
import {authRoutes} from "./routes/auth.routes";
import {userRoutes} from "./routes/user.routes";

dotenv.config();

const app: Express = express();


app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
	res.json({ message: "Welcome to Authentication application." });
});

authRoutes(app);
userRoutes(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, async () => {
	await connect({db: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`})
	console.log(`Server is running on port ${PORT}.`);
});
