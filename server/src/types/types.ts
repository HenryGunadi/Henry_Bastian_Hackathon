import {UserDoc} from '../../db/models/user';

export interface UserStoreInterface {
	findUserByStakeAddress(stakeAddress: string): Promise<UserDoc | null>;
	insertUser(user: UserDoc): Promise<void>;
	updateUser(field: string, stakeAddress: string, updateValue: any): Promise<void>;
}
