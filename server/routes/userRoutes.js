import express from 'express';
import { test } from '../controllers/userController.js';
import { createOrder } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/test', test);
router.post('/create-order', authMiddleware, createOrder);

export default router;