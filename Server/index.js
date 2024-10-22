import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT ;
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

import usserRouter from './routes/user.js';

app.use('/user/register', usserRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});