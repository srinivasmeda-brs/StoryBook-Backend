import express from "express";

import {createUser,verifyEmail,loginUser,
    getUser,
    getStories
} from  '../controllers/userController.js';

const router = express.Router(); 

router.get('/re', getUser);
router.get('/re/:id',getStories);
router.post('/register', createUser);
router.get("/verifyemail/:verify_token", verifyEmail);
router.post("/login", loginUser);



export default router;