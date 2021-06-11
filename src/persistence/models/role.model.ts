import mongoose, {Document} from "mongoose";
import {IRole} from "../../types/role";


export type RoleDocument = IRole & Document

export const RoleSchema = new mongoose.Schema({
	name: String
})

export const Role = mongoose.model<RoleDocument>("Role", RoleSchema);