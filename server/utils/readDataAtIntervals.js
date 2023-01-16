const fs = require("fs");
const path = require("path");
const processAndStoreData = require("../utils/processAndStoreData");
const validateCsvString = require("../utils/validateCsvString");

// Function to read and process sales files
const processSales = () => {
  let salesIndex = 1;
  const maxIndex = 20; // Sale directory only contains 20 CSV files
  const interval = setInterval(() => {
    // Clear the interval if the maximum index is reached
    if (salesIndex === maxIndex) {
      clearInterval(interval);
    }
    const filePath = path.join("data", "sales", `sales_${salesIndex}.csv`);

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
  }, 60 * 1000); // Run every 60 seconds
};

// Function to read and process products files
const processProducts = () => {
  let productIndex = 1;
  const maxIndex = 10; // Product Directory only contains 10 CSV files
  const interval = setInterval(() => {
    // Clear the interval if the maximum index is reached
    if (productIndex === maxIndex) {
      clearInterval(interval);
    }
    const filePath = path.join(
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
  }, 90 * 1000); // Run every 90 seconds
};

module.exports = {
  processSales,
  processProducts,
};
