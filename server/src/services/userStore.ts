import mongoose from 'mongoose';
import User, {UserDoc} from '../../db/models/user';
import {UserStoreInterface} from '../types/types';

class UserStore implements UserStoreInterface {
	// attributes
	private userModel: mongoose.Model<UserDoc>;

	// constructore
	constructor(userModel: mongoose.Model<UserDoc>) {
		this.userModel = userModel;
	}

	// Methods
	// Get single user
	async findUserByStakeAddress(stakeAddress: string): Promise<UserDoc | null> {
		let user: UserDoc | null = null;

		try {
			user = await this.userModel.findOne({stakeAddress: stakeAddress});

			if (user) {
				console.log('user found : ', user);
			} else {
				console.log('user not found.');
			}
		} catch (err) {
			console.error('Error finding user : ', err);
		}

		return user;
	}

	// create user
	async insertUser(user: UserDoc): Promise<void> {
		try {
			const newUser = new this.userModel(user);
			const savedUser = await newUser.save();

			console.log('User added : ', savedUser);
		} catch (err) {
			console.error('error inserting new user : ', err);
		}
	}

	// updateUser
	async updateUser(field: string, stakeAddress: string, updateValue: any): Promise<void> {
		try {
			const udpateObject = {[field]: updateValue};

			const result = await this.userModel.updateOne({stakeAddress: stakeAddress}, {$set: udpateObject});

			if (result.modifiedCount > 0) {
				console.log('User field updated.');
			} else {
				console.log('No matching user found or no changes made');
			}
		} catch (err) {
			console.error('error updating user : ', err);
		}
	}
}

export default UserStore;