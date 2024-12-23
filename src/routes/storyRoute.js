import express from 'express';
import { getStories, createStory, updateStory,
    getStory,updateLike,addComment,
    deleteStory, publishStory,authorStories} from '../controllers/storyController.js';

const router = express.Router();

// Get all stories
router.get("/stories", getStories);

// Create a new story (requires authorId to match)
router.post("/stories", createStory);

router.get("/stories/author/:authorId",authorStories)

//Get Specific Story 
router.get('/stories/:storyId', getStory);

// Update an existing story (only if the authorId matches)
router.put("/stories/:storyId", updateStory);

// Delete a story (only if the authorId matches)
router.delete("/stories/:storyId", deleteStory);

// Route to handle like updates
router.put('/stories/:id/like', updateLike);

// Route to handle adding comments
router.post('/stories/:id/comment', addComment);


// Publish a story (only if the authorId matches)
router.patch("/stories/:storyId/publish", publishStory);

export default router;
