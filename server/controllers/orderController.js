// Import necessary modules
import { Order } from "../models/ordersModel.js";
import User from "../models/userModel.js";
import Item from "../models/ItemModel.js";
import mongoose from "mongoose";

// Controller to handle order creation
export const createOrder = async (req, res) => {
  try {
    const { orderItems, amount, address, status } = req.body;

    // Assuming you have the user ID in the request (e.g., from authentication middleware)
    const userId = req.body.user._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    console.log("userfound");

    const orderedItems = [];

    for (const orderItem of orderItems) {
      const { item, quantity, price } = orderItem;

      // Check if the item is a valid ObjectId
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
    console.log("order saved", savedOrder);

    // Update the user's orders array with the new order ID
    await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });

    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
