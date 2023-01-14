const validate = (data) => {
  const saleKeys = [
    "transaction_id",
    "product_id",
    "quantity",
    "total_transaction_amount",
    "transaction_date",
  ];

  const productKeys = [
    "product_id",
    "product_name",
    "brand_name",
    "cost_price",
    "selling_price",
    "category",
    "expiry_date",
  ];

  return (
    ((data["product_id"] || data["transaction_id"]) &&
      Object.keys(data).every((item) => saleKeys.includes(item))) ||
    Object.keys(data).every((item) => productKeys.includes(item))
  );
};

module.exports = validate;
