import express from 'express';
import { test } from '../controllers/userController.js';
import { createOrder, getAllOrders, myOrders } from '../controllers/orderController.js';
import { authMiddleware, authMiddlewareAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/test', test);
router.post('/create-order', authMiddleware, createOrder);
router.get(`/myOrders`, authMiddleware, myOrders);
router.get(`/allOrders`, authMiddlewareAdmin, getAllOrders);


export default router;