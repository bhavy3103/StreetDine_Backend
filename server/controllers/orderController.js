// controllers/orderController.js
import mongoose from "mongoose";
import { Order } from "../models/ordersModel.js";
import { Payment } from "../models/paymentModel.js";
import User from "../models/userModel.js";
import Item from "../models/ItemModel.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, amount, address, status, paymentMethod } = req.body;

    const userId = req.body.user._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const orderedItems = [];

    for (const orderItem of orderItems) {
      const { item, quantity, price } = orderItem;

      if (!mongoose.Types.ObjectId.isValid(item)) {
        return res.status(400).json({ error: `Invalid item ID: ${item}` });
      }

      const existingItem = await Item.findById(item);
      if (!existingItem) {
        return res.status(400).json({ error: `Item with ID ${item} not found` });
      }

      const orderedItem = {
        item: existingItem._id,
        quantity,
        price,
      };
      orderedItems.push(orderedItem);
    }

    const newOrder = new Order({
      orderItems: orderedItems,
      amount,
      address,
      status,
      user: userId,
    });

    const savedOrder = await newOrder.save();

    // Create a payment for the order
    const payment = new Payment({
      user: userId,
      order: savedOrder._id,
      amount,
      paymentMethod,
      // Add additional fields related to payment if needed
    });

    const savedPayment = await payment.save();

    // Update the order with the payment ID
    savedOrder.payment = savedPayment._id;
    await savedOrder.save();

    // Update the user's orders array with the new order ID
    await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });

    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const myOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error, error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    // Assuming you have some logic to check if the user is an admin
    // You can adapt this based on your authentication and authorization logic
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    const allOrders = await Order.find().populate('user', 'username'); // Populate user details

    res.status(200).json({ orders: allOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};