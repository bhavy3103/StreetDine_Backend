import mongoose from "mongoose";
import Item from "./ItemModel.js";

const OrderedItemsSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  delivered: {
    type: Boolean,
    default: false, // Set default to false, indicating the item is not delivered initially
  },
});

const orderSchema = new mongoose.Schema({
  orderItems: [OrderedItemsSchema],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  paymentStatus: {
    type: String,
    default: "unpaid", // Add a default value or adjust as needed
  },
}, {
  timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);

export { Order };
