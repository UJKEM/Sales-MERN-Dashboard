const express = require("express");

const router = express.Router();

//Sale Schema(Model)
const Sale = require("../../models/Sale");

//Product Schema(Model)
const Product = require("../../models/Product");

//@route  GET api /
//@desc Get all sales and products
//@access public
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find({});
    const products = await Product.find({});
    const result = {};
    if (sales.length) {
      result.sales = sales;
    }
    if (products.length) {
      result.products = products;
    }

    if (sales.length === 0 && products.length === 0) {
      return res.status(404).send({
        message: "No data found",
      });
    }
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

//@route  GET api/sales/sales-by-product
//@desc Get all sales by product
//@access public
router.get("/sales-by-product", async (req, res) => {
  try {
    // Query the database for sales data and product data
    const sales = await Sale.find();
    const products = await Product.find();
    if (sales.length < 1 || products.length < 1) {
      return res.status(404).send({
        message:
          "Cannot perform operation. One or both the collections are empty",
      });
    }

    // Group sales data by product
    const salesByProduct = sales.reduce((acc, sale) => {
      const product = products.find((p) => p.product_id === sale.product_id);
      if (product) {
        const productId = sale.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            productId: productId,
            productName: product.product_name,
            brandName: product.brand_name,
            category: product.category,
            totalQuantitySold: 0,
            totalRevenue: 0,
            totalProfit: 0,
          };
        }
        acc[productId].totalQuantitySold += sale.quantity;
        acc[productId].totalRevenue += sale.total_transaction_amount;
        acc[productId].totalProfit +=
          sale.total_transaction_amount - sale.quantity * product.cost_price;
      }
      return acc;
    }, {});

    const productsArray = Object.values(salesByProduct);

    if (!productsArray) {
      return res.status(404).send({
        message:
          "Cannot perform operation. One or both the collections are empty",
      });
    }

    //Calculate most profitable product
    const mostProfitableProduct = productsArray.reduce((acc, product) => {
      if (!acc || product.totalProfit > acc.totalProfit) {
        return product;
      }
      return acc;
    }, null);

    //Calculate least profitable product
    const leastProfitableProduct = productsArray.reduce((acc, product) => {
      if (!acc || product.totalProfit < acc.totalProfit) {
        return product;
      }
      return acc;
    }, null);
    res.status(200).send({
      result: Object.keys(salesByProduct).map((key, index) => ({
        [index]: salesByProduct[key],
      })),
      mostProfitableProduct,
      leastProfitableProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

//@route  GET api/sales/sales-by-brand
//@desc Get all sales by brand
//@access public
router.get("/sales-by-brand", async (req, res) => {
  try {
    // Query the database for sales data and product data
    const sales = await Sale.find();
    const products = await Product.find();

    if (sales.length < 1 || products.length < 1)
      return res.status(404).send({
        message:
          "Cannot perform operation. One or both the collections are empty",
      });

    // Group sales data by brand
    const salesByBrand = sales.reduce((acc, sale) => {
      const product = products.find((p) => p.product_id === sale.product_id);
      if (product) {
        const brandName = product.brand_name;
        if (!acc[brandName]) {
          acc[brandName] = {
            brandName: brandName,
            totalQuantitySold: 0,
            totalRevenue: 0,
            totalProfit: 0,
            mostSoldProduct: "",
            mostSoldProductQuantity: 0,
          };
        }
        acc[brandName].totalQuantitySold += sale.quantity;
        acc[brandName].totalRevenue += sale.total_transaction_amount;
        acc[brandName].totalProfit +=
          sale.total_transaction_amount - sale.quantity * product.cost_price;
        if (sale.quantity > acc[brandName].mostSoldProductQuantity) {
          acc[brandName].mostSoldProduct = product.product_name;
          acc[brandName].mostSoldProductQuantity = sale.quantity;
        }
      }
      return acc;
    }, {});

    // Send the response back to the client
    return res.status(200).send({
      result: Object.keys(salesByBrand).map((key, index) => ({
        [index]: salesByBrand[key],
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

//@route  GET api/sales/highest-lowest-sales
//@desc Get highest and lowest sales by date
//@access public
router.get("/highest-lowest-sales", async (req, res) => {
  try {
    // Query the database for sales data and product data
    const sales = await Sale.find();
    const products = await Product.find();

    if (sales.length < 1 || products.length < 1)
      return res.status(404).send({
        message:
          "Cannot perform operation. One or both the collections are empty",
      });

    // Group sales data by date
    const salesByDate = sales.reduce((acc, sale) => {
      const date = sale.transaction_date;
      const product = products.find((p) => p.product_id === sale.product_id);
      if (product) {
        if (!acc[date]) {
          acc[date] = {
            date: date,
            totalSales: 0,
            products: [],
          };
        }

        acc[date].totalSales += sale.total_transaction_amount;
        acc[date].products.push({
          productId: product.product_id,
          productName: product.product_name,
          brandName: product.brand_name,
          category: product.category,
          quantitySold: sale.quantity,
          totalTransactionAmount: sale.total_transaction_amount,
        });
      }
      return acc;
    }, {});

    // Determine the date of highest and least sales and the products sold on those dates
    const datesArray = Object.values(salesByDate);
    const highestSales = datesArray.reduce((acc, date) => {
      if (!acc || date.totalSales > acc.totalSales) {
        return date;
      }
      return acc;
    }, null);
    const lowestSales = datesArray.reduce((acc, date) => {
      if (!acc || date.totalSales < acc.totalSales) {
        return date;
      }
      return acc;
    }, null);

    // Send the response back to the client
    return res.status(200).send({
      highestSales,
      lowestSales,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
});

module.exports = router;
