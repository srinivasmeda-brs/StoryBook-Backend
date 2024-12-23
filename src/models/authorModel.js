// import mongoose from "mongoose";



// const authorSchema = new mongoose.Schema({
//   first_name: { type: String, required: true },
//   last_name: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: true }, 
//   verified: { type: Boolean, default: false },
//   token: { type: String },
//   isAuthor: { type: Boolean, default: true},
//   verify_token: { type: String },
//   verify_token_expires: Date,// For admin authentication
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Virtual field to fetch stories written by the author
// authorSchema.virtual("stories", {
//   ref: "Story",
//   localField: "_id",  // Referring to the _id of the Author
//   foreignField: "authorId",  // Referring to the authorId field in the Story schema
// });
// const Author = mongoose.model("Author", authorSchema);

// export default Author;
