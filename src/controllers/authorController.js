// import Author from '../models/authorModel.js';
// import mongoose from 'mongoose';

// const getUser = async(req,res,next) => {
//       try{
//          const author = await Author.find({})
//          res.json(author)
//       }catch(err){
//         next(err)
//         }
// }

// const authorStories = async (req, res, next) => {
//     const { id } = req.params;
//     Author.findById(id)  // Pass the `id` directly, without using an object
//       .populate('stories')  // Populating the virtual field 'stories'
//       .then(author => {
//         if (!author) {
//           return res.status(404).json({ message: 'Author not found' });
//         }
//         res.json(author);  // This will show the author along with the populated stories
//       })
//       .catch(err => {
//         console.error(err);  // Log any errors in the console
//         res.status(500).json({ message: 'Server error' });
//       });
//   };


// export {getUser,authorStories} 