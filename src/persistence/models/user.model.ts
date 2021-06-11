import {IUser} from "../../types/user";
import mongoose, {Document} from "mongoose";

type UserDocument = IUser & Document;

const UserSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	roles: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Role"
	}]
});

export const User =  mongoose.model<UserDocument>("User", UserSchema)