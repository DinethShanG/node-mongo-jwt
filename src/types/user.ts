import {IRole} from "./role";

export interface IUser{
	username: string
	email: string
	password: string
	roles: IRole[]
}