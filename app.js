import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectdb from './src/config/db.js';
import { notFound, errorHandler } from './src/middleWare/errMiddleWare.js';
import userRoute from './src/routes/userRoute.js';
import storyRoute from './src/routes/storyRoute.js';

const app = express();
const port = process.env.PORT || 3005;

dotenv.config();
connectdb();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'https://storybook-jbeo.onrender.com', // Make sure this matches your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight requests
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers your frontend may send
    credentials: true, // Allow cookies or authorization headers
    preflightContinue: false, // Ensures preflight requests get a response
    optionsSuccessStatus: 200 // For legacy browsers that might choke on a 204 response to OPTIONS
}));

// Routes
app.use('/api/users', userRoute);
app.use('/api', storyRoute);

// Handle 404 errors (Not Found)
app.use(notFound);

// Handle errors globally
app.use(errorHandler);

// Test route
app.get('/', (req, res) => {
    console.log("hello srinivas");
    res.send("hello srinivas");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
