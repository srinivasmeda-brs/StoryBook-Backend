import Story from '../models/storyModel.js';

const getStories = async(req,res,next) => {
    try{
        const stories = await Story.find({});
        res.json(stories)
    }catch(err){
        next(err);
    }
       
}

const authorStories = async (req, res, next) => {
  const { authorId } = req.params; // Use 'authorId' instead of 'userId'

  try {
    // Find stories by authorId
    const stories = await Story.find({ userId: authorId });

    if (!stories || stories.length === 0) {
      return res.status(404).json({ message: 'No stories found for this author' });
    }

    res.json(stories); // Return the found stories
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: 'Something went wrong while fetching stories' });
  }
};


const createStory = async (req, res, next) => {
    try {
        const { title, content, userId } = req.body;

        if (userId !== req.body.userId) {
            return res.status(403).json({ message: 'You are not authorized to create this story' });
        }

        const newStory = new Story({
            title,
            content,
            userId,
            isPublished: false, // Initially, not published
        });

        await newStory.save();
        res.status(201).json(newStory);
    } catch (err) {
        next(err);
    }
};

const getStory = async (req, res, next) => {
    try {
      const id = req.params.storyId; // Access storyId, not id
      const story = await Story.findById(id);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      res.json(story);
    } catch (err) {
      next(err);
    }
  };
      

const updateStory = async (req, res, next) => {
    try {
        const { storyId } = req.params;
        const updatedData = req.body;
        
        // Find the story by ID
        const story = await Story.findById(storyId);
        
        // Check if the story exists and if the requester is the author
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        if (story.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: 'You are not authorized to update this story' });
        }

        // Update the story with the provided data
        const updatedStory = await Story.findByIdAndUpdate(storyId, updatedData, { new: true });

        res.json(updatedStory);
    } catch (err) {
        next(err);
    }
};

const deleteStory = async (req, res, next) => {
    try {
        const { storyId } = req.params;
        
        // Find the story by ID
        const story = await Story.findById(storyId);

        // Check if the story exists and if the requester is the author
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // if (story.userId.toString() !== req.body.userId) {
        //     return res.status(403).json({ message: 'You are not authorized to delete this story' });
        // }

        // Delete the story
        await Story.findByIdAndDelete(storyId);

        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (err) {
        next(err);
    }
};
const publishStory = async (req, res, next) => {
    try {
        const { storyId } = req.params;
        
        // Find the story by ID
        const story = await Story.findById(storyId);

        // Check if the story exists and if the requester is the author
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // if (story.userId.toString() !== req.body.userId) {
        //     return res.status(403).json({ message: 'You are not authorized to publish this story' });
        // }

        // Set the story as published and set the publish date
        story.isPublished = true;
        story.publishedAt = new Date();
        await story.save();

        res.json(story);
    } catch (err) {
        next(err);
    }
};

const updateLike = async (req, res, next) => {
    try {
        const { id } = req.params; // Story ID
        const { userId } = req.body; // User ID from the request body

        // Find the story by ID
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Ensure likesSummary is initialized as an array
        if (!Array.isArray(story.likesSummary)) {
            story.likesSummary = [];
        }

        // Check if the user has already liked the story
        const hasLiked = story.likesSummary.includes(userId);

        if (hasLiked) {
            // If user already liked, remove their ID and decrement the like count
            story.likesSummary = story.likesSummary.filter((id) => id !== userId);
            story.likes = Math.max(story.likes - 1, 0); // Ensure likes don't go below 0
        } else {
            // If user hasn't liked, add their ID and increment the like count
            story.likesSummary.push(userId);
            story.likes += 1;
        }

        await story.save();
        res.status(200).json({
            message: 'Like status updated successfully',
            likes: story.likes,
            likesSummary: story.likesSummary,
        });
    } catch (err) {
        next(err);
    }
};


const addComment = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { comment, userId, first_name } = req.body; // Include first_name
  
      // Find the story by ID
      const story = await Story.findById(id);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
  
      // Add the new comment to the comments array
      story.comments.push({
        comment,
        first_name,  // Store first name with comment
        createdAt: new Date(),
      });
  
      await story.save();
      res.json(story); // Return the updated story with the new comment
    } catch (err) {
      next(err);
    }
  };
  







export {getStories,
    createStory,
    updateStory,
    getStory,
    deleteStory,
    publishStory,
    updateLike,
    addComment,
    authorStories
};
