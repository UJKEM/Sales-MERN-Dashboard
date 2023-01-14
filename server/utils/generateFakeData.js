const fs = require("fs");
const path = require("path");

//Data Faker Module
const Chance = require("chance");
const chance = new Chance();

//CSV Parser Module
const stringify = require("csv-stringify").stringify;

const generateFakeData = () => {
  const numSalesFiles = 20;
  const numRowsPerSalesFile = 100;
  const numProductsFiles = 10;
  const numRowsPerProductsFile = 10;
  const dataDir = path.join("data");
  const salesDir = path.join("data", "sales");
  const productsDir = path.join("data", "products");

  //Check if the data directory exists or not
  if (!fs.existsSync(dataDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(dataDir);
  }

  // Check if the sales directory exists
  if (!fs.existsSync(salesDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(salesDir);
  }

  //Required to store product ids which will be used in Product's product_id to perform join operation
  const productIds = [];
  // Generate fake sales data
  for (let i = 0; i < numSalesFiles; i++) {
    const data = [];
    data.push({
      transaction_id: "transaction_id",
      product_id: "product_id",
      quantity: "quantity",
      total_transaction_amount: "total_transaction_amount",
      transaction_date: "transaction_date",
    });
    for (let j = 0; j < numRowsPerSalesFile; j++) {
      //Push the header row for Sale
      const product_id = chance.guid();
      productIds.push(product_id);
      data.push({
        transaction_id: chance.guid(),
        product_id: product_id,
        quantity: chance.integer({ min: 1, max: 100 }),
        total_transaction_amount: chance.floating({
          min: 100000,
          max: 10000000,
          fixed: 2,
        }),
        transaction_date: chance.date({ string: true, american: false }),
      });
    }
    stringify(data, (err, output) => {
      if (err) {
        console.error(err);
        return;
      }
      fs.writeFileSync(`${salesDir}/sales_${i + 1}.csv`, output);
    });
  }

  // Check if the products directory exists
  if (!fs.existsSync(productsDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(productsDir);
  }
  const categories = [
    "Electronics",
    "Home and Kitchen",
    "Clothing and Accessories",
    "Beauty and Personal Care",
    "Books and Audible",
    "Automotive",
    "Toys and Games",
    "Sports and Outdoors",
    "Health and Wellness",
    "Grocery and Gourmet Food",
    "Baby",
    "Pet Supplies",
    "Office Products",
    "Musical Instruments",
    "Industrial and Scientific",
    "Craft and Hobbies",
  ];
  // Generate fake products data
  for (let i = 0; i < numProductsFiles; i++) {
    const data = [];
    //Push the header row for Product
    data.push({
      product_id: "product_id",
      product_name: "product_name",
      brand_name: "brand_name",
      cost_price: "cost_price",
      selling_price: "selling_price",
      category: "category",
      expiry_date: "expiry_date",
    });
    for (let j = 0; j < numRowsPerProductsFile; j++) {
      data.push({
        product_id: productIds[Math.floor(Math.random() * 10)],
        product_name: chance
          .word({ capitalize: true, syllables: 4 })
          .replace(/[",]+/g, ""),
        brand_name: chance.company().replace(/[",]+/g, ""),
        cost_price: chance.floating({ min: 0, max: 100000, fixed: 2 }),
        selling_price: chance.floating({ min: 0, max: 10000000, fixed: 2 }),
        category: chance.pickone(categories),
        expiry_date: chance.date({ string: true, future: true }),
      });
    }
    stringify(data, (err, output) => {
      if (err) {
        console.error(err);
        return;
      }
      fs.writeFileSync(`${productsDir}/products_${i + 1}.csv`, output);
    });
  }
};

module.exports = generateFakeData;
