import mongoose from 'mongoose';
import {Role} from "./models/role.model";

const connect = async ({db}: {db:string}) => {
	try {
		await mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true,})
			.then(() => {
				console.log(`Successfully connected to ${db}`)
				initializeDB();
			});
	}
	catch (error){
		console.log(`An error occurred while connecting to ${db}`);
		throw error;
	}
}

const initializeDB = async () => {
	await Role.estimatedDocumentCount()
		.then(count => {
			if( count === 0) {
				new Role({
					name: "user"
				}).save(err => {
					if (err) {
						console.log("error", err);
					}

					console.log("added 'user' to roles collection");
				});

				new Role({
					name: "moderator"
				}).save(err => {
					if (err) {
						console.log("error", err);
					}

					console.log("added 'moderator' to roles collection");
				});

				new Role({
					name: "admin"
				}).save(err => {
					if (err) {
						console.log("error", err);
					}

					console.log("added 'admin' to roles collection");
				});
			}
		})
		.catch(err => {
			console.log(err)
		})
}

export default connect;