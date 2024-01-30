import express from 'express';
// import { test } from '../controllers/userController.js';
import createItem from '../controllers/ItemController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-item', authMiddleware, createItem);

export default router;