import express from 'express';
import { getStories, createStory, updateStory,
    getStory,updateLike,addComment,
    deleteStory, publishStory,authorStories} from '../controllers/storyController.js';

const router = express.Router();

router.get("/stories", getStories);

router.post("/stories", createStory);

router.get("/stories/author/:authorId",authorStories)

router.get('/stories/:storyId', getStory);

router.put("/stories/:storyId", updateStory);

router.delete("/stories/:storyId", deleteStory);

router.put('/stories/:id/like', updateLike);

router.post('/stories/:id/comment', addComment);


router.patch("/stories/:storyId/publish", publishStory);

export default router;
