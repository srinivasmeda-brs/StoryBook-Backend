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

// Update CORS configuration to allow frontend URL and add more specific settings
app.use(cors({
  origin: 'https://storybook-jbeo.onrender.com', // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers in the request
  credentials: true, // Allow cookies and other credentials
}));

// Routes
app.use('/api/users', userRoute);
app.use('/api/', storyRoute);

app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
    console.log("hello srinivas");
    res.send("hello srinivas");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
