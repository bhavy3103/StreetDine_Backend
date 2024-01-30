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
        delivered: false,
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

    const payment = new Payment({
      user: userId,
      order: savedOrder._id,
      amount,
      paymentMethod,
    });

    const savedPayment = await payment.save();

    savedOrder.payment = savedPayment._id;
    await savedOrder.save();

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


export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status, amount, address, orderItems } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: `Invalid order ID: ${orderId}` });
    }

    const existingOrder = await Order.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found` });
    }

    const hasDeliveredItems = existingOrder.orderItems.some(item => item.delivered);
    if (hasDeliveredItems) {
      return res.status(400).json({ error: 'Cannot update order with delivered items' });
    }

    existingOrder.status = status || existingOrder.status;
    existingOrder.amount = amount || existingOrder.amount;
    existingOrder.address = address || existingOrder.address;

    if (orderItems && Array.isArray(orderItems)) {
      existingOrder.orderItems = orderItems;
    }

    const updatedOrder = await existingOrder.save();

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
