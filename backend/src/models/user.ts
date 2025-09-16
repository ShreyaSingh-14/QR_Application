import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: String,
  name: String,
  email: String,
  authProvider: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
