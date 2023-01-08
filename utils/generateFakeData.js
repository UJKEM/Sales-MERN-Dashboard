const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const generateFakeData = () => {
  const numSalesFiles = 20;
  const numRowsPerSalesFile = 100;
  const numProductsFiles = 10;
  const numRowsPerProductsFile = 10;
  const salesDir = path.join(__dirname, "./data", "sales");
  const productsDir = path.join(__dirname, "./data", "products");

  // Generate fake sales data
  for (let i = 0; i < numSalesFiles; i++) {
    const data = [];
    for (let j = 0; j < numRowsPerSalesFile; j++) {
      data.push({
        transaction_id: chance.guid(),
        product_id: chance.guid(),
        quantity: chance.integer({ min: 1, max: 100 }),
        total_transaction_amount: chance.floating({
          min: 0,
          max: 1000,
          fixed: 2,
        }),
        transaction_date: chance.date({ string: true, american: false }),
      });
    }
    fs.writeFileSync(`${salesDir}/sales_${i + 1}.csv`, csv.format(data));
  }

  // Generate fake products data
  for (let i = 0; i < numProductsFiles; i++) {
    const data = [];
    for (let j = 0; j < numRowsPerProductsFile; j++) {
      data.push({
        product_id: chance.guid(),
        product_name: chance.sentence({ words: 3 }),
        brand_name: chance.company(),
        cost_price: chance.floating({ min: 0, max: 1000, fixed: 2 }),
        selling_price: chance.floating({ min: 0, max: 1000, fixed: 2 }),
        category: chance.word({ length: 6 }),
        expiry_date: chance.date({ string: true, american: false }),
      });
    }
    fs.writeFileSync(`${productsDir}/products_${i + 1}.csv`, csv.format(data));
  }
};

module.exports = generateFakeData;
