const processAndStoreData = (data) => {
  // Convert the data string to a JavaScript object
  const rows = data.split("\n");
  const keys = rows[0].split(",");
  const records = rows.slice(1).map((row) => {
    const values = row.split(",");
    return keys.reduce((record, key, index) => {
      record[key] = values[index];
      return record;
    }, {});
  });

  // Determine the collection to store the data in based on the first key
  const collectionName = keys[0];
  let schema;
  switch (collectionName) {
    case "transaction_id":
      schema = Sales;
      break;
    case "product_id":
      schema = Product;
      break;
    default:
      console.error(`Invalid collection name: ${collectionName}`);
      return;
  }

  // Insert the records into the collection
  schema.insertMany(records, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(
      `Inserted ${result.insertedCount} records into the ${collectionName} collection`
    );
  });
};

module.exports = processAndStoreData;
