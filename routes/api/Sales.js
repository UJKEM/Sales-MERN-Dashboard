const express = require("express");

const router = express.Router();

//Sale Schema
const Sale = require("../../models/Sale");

//@route  GET api/sales
//@desc Get all sales
//@access public
router.get("/sales", async (req, res) => {
  try {
    const sales = await Sale.find({});
    if (!sales) {
      return res.status(404).json({ message: "No Sale found" });
    }
    return res.status(200).json(sales);
  } catch (err) {
    console.log(err);
  }
});

//@route  GET api/sales-by-product
//@desc Get all sales by product
//@access public
router.get("/sales-by-product", (req, res) => {
  // Use the `aggregate` function to get the sales data by product
  Sale.aggregate(
    [
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product_data",
        },
      },
      {
        $unwind: "$product_data",
      },
      {
        $group: {
          _id: "$product_id",
          product_name: { $first: "$product_data.product_name" },
          brand_name: { $first: "$product_data.brand_name" },
          category: { $first: "$product_data.category" },
          quantity: { $sum: "$quantity" },
          revenue: { $sum: "$total_amount" },
          profit: {
            $sum: {
              $subtract: [
                "$total_amount",
                { $multiply: ["$quantity", "$product_data.cost_price"] },
              ],
            },
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
    ],
    (err, results) => {
      if (err) throw err;

      // Find the most and least profitable products
      const mostProfitableProduct = results.reduce(
        (mostProfitable, product) => {
          return product.profit > mostProfitable.profit
            ? product
            : mostProfitable;
        },
        results[0]
      );

      const leastProfitableProduct = results.reduce(
        (leastProfitable, product) => {
          return product.profit < leastProfitable.profit
            ? product
            : leastProfitable;
        },
        results[0]
      );
      res
        .status(200)
        .send({ results, mostProfitableProduct, leastProfitableProduct });
    }
  );
});

//@route  GET api/sales-by-brand
//@desc Get all sales by brand
//@access public
router.get("/sales-by-brand", (req, res) => {
  // Use the `aggregate` function to get the sales data by brand
  TransactionModel.aggregate(
    [
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "product_id",
          as: "product_data",
        },
      },
      {
        $unwind: "$product_data",
      },
      {
        $group: {
          _id: "$product_data.brand_name",
          most_sold: {
            $first: {
              product_name: "$product_data.product_name",
              quantity: { $sum: "$quantity" },
            },
          },
          total_quantity: { $sum: "$quantity" },
          total_revenue: { $sum: "$total_amount" },
          total_profit: {
            $sum: {
              $subtract: [
                "$total_amount",
                { $multiply: ["$quantity", "$product_data.cost_price"] },
              ],
            },
          },
          highest_sales: {
            $max: {
              $cond: {
                if: { $gt: ["$total_amount", 0] },
                then: "$transaction_date",
                else: null,
              },
            },
          },
          lowest_sales: {
            $min: {
              $cond: {
                if: { $gt: ["$total_amount", 0] },
                then: "$transaction_date",
                else: null,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          brand_name: "$_id",
          most_sold: 1,
          total_quantity: 1,
          total_revenue: 1,
          total_profit: 1,
          highest_sales: 1,
          lowest_sales: 1,
        },
      },
      {
        $sort: {
          total_revenue: -1,
        },
      },
    ],
    (err, results) => {
      if (err) throw err;

      // Return the results
      res.send(results);
    }
  );
});
