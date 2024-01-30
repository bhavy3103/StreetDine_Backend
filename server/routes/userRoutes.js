import express from 'express';
import { test } from '../controllers/userController.js';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/test', test);
router.post('/create-order', createOrder);

export default router;