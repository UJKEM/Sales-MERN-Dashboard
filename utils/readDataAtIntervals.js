const fs = require("fs");
const path = require("path");
const processAndStoreData = require("./processAndStoreData");

const salesDir = "data/sales";
const productDir = "data/products";

// Set the intervals for processing the sales and products files
const salesInterval = 60 * 1000; // 60 seconds
const productInterval = 90 * 1000; // 90 seconds

let salesIndex = 1;
let productIndex = 1;

// Function to read and process sales files
const processSales = () => {
  const filePath = path.join(salesDir, `sales_${salesIndex}.csv`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Process the data and store it in MongoDB
    processAndStoreData(data);

    // Increment the index for the next file
    salesIndex++;
  });
};

// Function to read and process products files
const processProducts = () => {
  const filePath = path.join(productDir, `products_${productIndex}.csv`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Process the data and store it in MongoDB
    processAndStoreData(data);

    // Increment the index for the next file
    productIndex++;
  });
};

// Set the intervals for reading and processing the sales and products files
setInterval(processSales, salesInterval);
setInterval(processProducts, productInterval);
