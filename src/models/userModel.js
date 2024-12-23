import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  token: { type: String },
  isAuthor:{ type: Boolean, default: false},
  isAdmin:{ type: Boolean, default: false},
  verify_token: { type: String },
  verify_token_expires: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// // Virtual field to fetch stories written by the user
// userSchema.virtual("stories", {
//   ref: "Story",
//   localField: "_id",  // Referring to the _id of the User
//   foreignField: "userId",  // Referring to the userId field in the Story schema
// });

const User = mongoose.model("User", userSchema);

export default User;
