import express from 'express';
// import { test } from '../controllers/userController.js';
import createItem from '../controllers/ItemController.js';

const router = express.Router();

router.post('/create-item', createItem);

export default router;