import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true }, // Text content only
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPublished: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  comments: { type: Array, default: [] }, // Array to store comments directly
  likesSummary:{type:Array, default:[], trim: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date, default: null }, // Null if unpublished
  
});

// // Virtual field to fetch comments for a story
// storySchema.virtual("comments", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "storyId",
// });

const Story = mongoose.model("Story", storySchema);

export default Story;
