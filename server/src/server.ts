import express from 'express';
import mongoose from 'mongoose';
import {connectDB} from '../db/config/db';
import userRouter from './routes/users';
import authRouter from './routes/auth';

const app = express();
// Middlewares
app.use(express.json()); // allow to accept data in JSON format
app.use(express.urlencoded({extended: true})); // URL-encoded data for dealing with forms

// connectDB
connectDB();

// ROUTERS
app.use('/users', userRouter);
app.use('/auth', authRouter);

const port = process.env.PORT || 8000;
app.listen(8000, () => console.log(`Server started on port ${port}`));
