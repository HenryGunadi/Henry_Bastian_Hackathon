import mongoose from 'mongoose';
import {UserDoc} from '../../db/models/user';
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
			user = await this.userModel.findOne({stake_addr: stakeAddress});

			if (!user) {
				console.log('User not found');
				return null;
			}

			return user;
		} catch (err) {
			console.error('Error finding user : ', err);
			return null;
		}
	}

	// updateUser
	async updateUser(field: string, stakeAddress: string, updateValue: any): Promise<void> {
		try {
			const udpateObject = {[field]: updateValue};
			let result: mongoose.UpdateWriteOpResult;

			if (field === 'roles') {
				result = await this.userModel.updateOne({stake_addr: stakeAddress}, {$addToSet: udpateObject});
			} else {
				result = await this.userModel.updateOne({stake_addr: stakeAddress}, {$set: udpateObject});
			}

			if (result.modifiedCount > 0) {
				console.log('User field updated.');
			} else {
				console.log('No matching user found or no changes made');
			}
		} catch (err) {
			console.error('error updating user : ', err);
		}
	}

	async findUserById(id: string): Promise<UserDoc | null> {
		try {
			const objectId = new mongoose.Types.ObjectId(id);

			const res = await this.userModel.findById({_id: objectId});

			if (res) {
				return res;
			} else {
				throw new Error('No record is found');
			}
		} catch (err) {
			console.error('error updating user : ', err);
			return null;
		}
	}
}

export default UserStore;
