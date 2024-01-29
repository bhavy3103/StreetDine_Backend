import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from "cors";
dotenv.config();
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB🥳🥳🚀');
}).catch((err) => {
  console.log(err);
});

const app = express();
app.use(cors());
app.use(express.json());


app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/item', itemRoutes);