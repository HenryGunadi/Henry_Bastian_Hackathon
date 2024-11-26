import mongoose from 'mongoose';

// typescript schemas
export interface UserDoc extends Document {
	stakeAddress: string;
	nonce: string | undefined;
	verified: boolean;
	}

// mongoDB schemas
const userSchema = new mongoose.Schema({
	stakeAddress: {type: String, required: true},
	nonce: {type: String, required: false},
	verified: {type: Boolean, required: true},
});

export default mongoose.model<UserDoc>('User', userSchema);
