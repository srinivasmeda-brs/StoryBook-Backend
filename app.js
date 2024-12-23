import express from 'express'; 
import dotenv from "dotenv";
import cors from 'cors';

import connectdb from './src/config/db.js';
import { notFound, errorHandler } from "./src/middleWare/errMiddleWare.js";
import userRoute from './src/routes/userRoute.js';
import storyRoute from './src/routes/storyRoute.js';

const app = express();
const port = process.env.PORT || 3005;


dotenv.config();
connectdb();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/users', userRoute);
app.use('/api/', storyRoute);

// Update CORS configuration to allow frontend URL
app.use(cors({
    origin: 'https://storybook-backend-gd6a.onrender.com', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
    console.log("hello srinivas");
    res.send("hello srinivas");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
