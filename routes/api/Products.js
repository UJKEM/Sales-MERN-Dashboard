const express = require("express");

const router = express.Router();

//Product Schema
const Product = require("../../models/Product");

//@route  GET api/products
//@desc Get all products
//@access public
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({ message: "No Product found" });
    }
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
});
