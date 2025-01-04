import mongoose, { Schema } from "mongoose";

// typescript schemas
export interface UserDoc extends Document {
  id: string;
  stakeAddress: string;
  nonce: string;
  verified: boolean;
  roles: string[];
}

// mongoDB schemas
const userSchema = new Schema<UserDoc>({
  stakeAddress: { type: String, required: true },
  nonce: { type: String, required: true },
  verified: { type: Boolean, required: true },
  roles: { type: [String], required: true },
});

const User = mongoose.model<UserDoc>("User", userSchema, "users");

export default User;
