const fs = require("fs");
const path = require("path");
const processAndStoreData = require("./processAndStoreData");

// Function to read and process sales files
const processSales = () => {
  let salesIndex = 1;
  const maxIndex = 10; // Sale directory only contains 10 CSV files
  const interval = setInterval(() => {
    const filePath = path.join(
      __dirname,
      "./data",
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

      // Clear the interval if the maximum index is reached
      if (salesIndex > maxIndex) {
        clearInterval(interval);
      }
    });
  }, 60 * 1000); // Run every 60 seconds
};

// Function to read and process products files
const processProducts = () => {
  let productIndex = 1;
  const maxIndex = 20; // Product Directory only contains 20 CSV files
  const interval = setInterval(() => {
    const filePath = path.join(
      __dirname,
      "./data",
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

      // Clear the interval if the maximum index is reached
      if (productIndex > maxIndex) {
        clearInterval(interval);
      }
    });
  }, 90 * 1000); // Run every 90 seconds
};

module.exports = {
  processSales,
  processProducts,
};
