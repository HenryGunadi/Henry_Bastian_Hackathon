import {generateNonce} from '@meshsdk/core';
import User, {UserDoc} from '../../db/models/user';

async function backendGetNonce(user: UserDoc, stakeAddress: string) {
	// do: store 'nonce' in user model in the database
	const nonce = generateNonce('I agree to the term and condition of the Mesh : ');

	if (user == null) {
		const userr = new User({
			stakeAddress: stakeAddress,
			nonce: nonce,
			verified: false,
		});
	} else {
		try {
			await User.updateOne({stakeAddress}, {$set: {nonce: nonce}});
		} catch (err) {
			console.error('updating user nonce field error : ', err);
		}
	}

	// do: return 'nonce'
}
