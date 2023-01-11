const Sale = require("../models/Sale");

const Product = require("../models/Product");

const validateCsvString = require("./validateCsvString");

const processAndStoreData = (data) => {
  if (
    !data ||
    data === "" ||
    data.length === 0 ||
    data === null ||
    data === undefined
  ) {
    throw new Error("Data is empty");
  }
  // Convert the data string to a JavaScript object
  const rows = data.split("\n");
  const keys = rows[0].split(",");
  const records = rows
    .slice(1)
    .filter((row) => row !== "") // filter out empty rows
    .map((row) => {
      const values = row.split(",");
      return keys.reduce((record, key, index) => {
        record[key] = values[index];
        return record;
      }, {});
    });

  //Validate if CSV converted adheres to Product or Sale schema
  if (!Object.keys(records).every((record) => validateCsvString(record)))
    throw new Error("Data is malformed");

  // Determine the collection to store the data in based on the first key
  const collectionName = keys[0];
  let schema;
  switch (collectionName) {
    case "transaction_id":
      schema = Sale;
      break;
    case "product_id":
      schema = Product;
      break;
    default:
      throw new Error(`Invalid collection name: ${collectionName}`);
      return;
  }

  // // Insert the records into the collection
  // schema.insertMany(records, (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log(
  //     `Inserted ${result.length} into the ${schema.modelName} collection`
  //   );
  // });
};

module.exports = processAndStoreData;
