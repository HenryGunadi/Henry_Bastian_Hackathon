import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  stakeAddress: { type: String, required: true },
  nonce: { type: String, required: false },
  verified: { type: Boolean, required: true },
});

export default mongoose.model("User", userSchema);
