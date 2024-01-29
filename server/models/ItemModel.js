import mongoose from "mongoose";

const ItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
})

const Item = mongoose.model("Item", ItemsSchema);

export default Item;
