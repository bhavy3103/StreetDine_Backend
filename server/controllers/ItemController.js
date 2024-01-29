// Import necessary modules
import Item from "../models/ItemModel.js";

const createItem = async (req, res) => {
  try {
    const { name, description, price, images, stock } = req.body;

    const newItem = new Item({
      name,
      description,
      price,
      images,
      stock,
    });

    const savedItem = await newItem.save();

    res.status(201).json({ message: "Item added successfully", item: savedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default createItem;
