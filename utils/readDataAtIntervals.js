const fs = require("fs");
const path = require("path");
const processAndStoreData = require("./processAndStoreData");

// Function to read and process sales files
const processSales = () => {
  let salesIndex = 1;
  const filePath = path.join(
    __dirname,
    "data",
    "sales",
    `sales_${salesIndex}.csv`
  );

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
  let productIndex = 1;

  const filePath = path.join(
    __dirname,
    "data",
    "products",
    `products_${productIndex}.csv`
  );

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

module.exports = {
  processSales,
  processProducts,
};
