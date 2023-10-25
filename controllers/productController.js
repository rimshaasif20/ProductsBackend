// productController.js

import mongoose from "mongoose";
import Products from "../models/productModel.js";
import Users from "../models/userModel.js";

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findById(userId);
    if (!user) {
      console.log("user", user);
      return res.status(404).json({ err: "User not found" });
    }

    const {
      pcode,
      name,
      brand,
      type,
      price,
      rating,
      warranty_years,
      available,
      tags,
    } = req.body;

    // if (!name || ! || !marks || !year) {
    //   return res
    //     .status(400)
    //     .json({ err: "Please fill in all fields properly" });
    // }

    const newProduct = await Products.create({
      pcode,
      name,
      brand,
      type,
      price,
      rating,
      warranty_years,
      available,
      tags,
      userId,
    });
    // Save the product to the database
    const savedProduct = await newProduct.save();

    if (savedProduct) {
      res.status(201).json({
        message: "Product added successfully",
        product: savedProduct,
      });
    } else {
      res.status(400).json({ error: "Invalid Product Data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createProductAggregationPipeline = () => {
  return [
    {
      $match: {
        pcode: { $ne: "ac11" },
      },
    },
    {
      $skip: 10, // skip method
    },
    // {
    //   $unwind: "$tags",
    // },
    {
      $lookup: {
        from: "products", // Name of the collection to join with
        localField: "pcode", // Field from the current collection
        foreignField: "pcode", // Field from the "products" collection
        as: "joinedData", // Alias for the joined data
      },
    },
    {
      $redact: {
        $cond: {
          if: { $eq: ["$available", true] },
          then: "$$KEEP",
          else: "$$PRUNE",
        },
      },
    },
    // {
    //   $out: "filteredProducts",
    // },
  ];
};

export const getAllProducts = async (req, res) => {
  try {
    const aggregationPipeline = createProductAggregationPipeline();

    const products = await Products.aggregate(aggregationPipeline);

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// export const getAll = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!userId) {
//       return res.status(400).json({ err: "User ID must be provided" });
//     }

//     const user = await Users.findById(userId);
//     if (!user) {
//       return res.status(404).json({ err: "User not found" });
//     }
//     const products = await Products.find({ userId: userId }).sort({ _id: -1 });

//     res.status(200).json({
//       message: "Tasks for the user retrieved successfully",
//       products: products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

const performProductAggregation = async (userId) => {
  const products = await Products.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  return products;
};

export const getAll = async (req, res) => {
  try {
    const userId = req.params.userId;

    const products = await performProductAggregation(userId);

    if (products.length === 0) {
      return res.status(404).json({ err: "No products found for this user" });
    }
    console.log(products);
    res.status(200).json({
      message: "Products for the user retrieved successfully",

      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// export const getAll = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     if (!userId) {
//       return res.status(400).json({ err: "User ID must be provided" });
//     }

//     const user = await Users.findById(userId);

//     if (!user) {
//       return res.status(404).json({ err: "User not found" });
//     }

//     const products = await Products.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $project: {
//           _id: 1, // Include the _id field if needed
//           name: 1,
//           brand: 1,
//           type: 1,
//           price: 1,
//           rating: 1,
//           warranty_years: 1,
//           available: 1,
//           tags: 1,
//           userId: 1,
//         },
//       },
//       // {
//       //   $sort: { _id: -1 },
//       // },
//     ]);

//     if (products.length === 0) {
//       return res.status(404).json({ err: "No products found for this user" });
//     }
//     console.log(products);
//     res.status(200).json({
//       message: "Products for the user retrieved successfully",
//       products: products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };
