import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  pcode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  warranty_years: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Products = mongoose.model("products", productSchema);

export default Products;
