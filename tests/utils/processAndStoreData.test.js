const assert = require("assert");
const sinon = require("sinon");

const mongoose = require("mongoose");

const Product = require("../../models/Product");
const Sale = require("../../models/Sale");

const processAndStoreData = require("../../utils/processAndStoreData");

describe("processAndStoreData", () => {
  beforeAll((done) => {
    mongoose
      .connect("mongodb://localhost:27017/test", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => done())
      .catch((err) => console.log(err));
  });

  afterEach(async () => {
    // Clean up the collections after each test
    await Sale.deleteMany({});
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("stores data with correct schema in Sale collection", async () => {
    const data = `transaction_id,product_id,quantity,total_transaction_amount,transaction_date\n123,456,2,10.99,2022-01-01\n789,101,3,20.99,2022-02-01\n`;
    processAndStoreData(data);
    setTimeout(async () => {
      try {
        const count = await Sale.countDocuments();
        expect(count).toEqual(2);
        const sale = await Sale.findOne({ transaction_id: "123" });
        expect(sale.product_id).toEqual("456");
        expect(sale.quantity).toEqual(2);
        expect(sale.total_transaction_amount).toEqual(10.99);
        expect(sale.transaction_date).toEqual("2022-01-01");
      } catch (err) {
        console.log(err);
      }
    });
  });

  it("stores data with correct schema in Product collection", async () => {
    const data = `product_id,product_name,brand_name,cost_price,selling_price,category,expiry_date\n123,test product,test brand,10,20,test category,2022-01-01\n789,test product 2,test brand 2,15,25,test category 2,2022-02-01\n`;
    processAndStoreData(data);
    setTimeout(async () => {
      try {
        const count = await Product.countDocuments();
        expect(count).toEqual(2);
        const product = await Product.findOne({ product_id: "123" });
        expect(product.product_name).toEqual("test product");
        expect(product.brand_name).toEqual("test brand");
        expect(product.cost_price).toEqual(10);
        expect(product.selling_price).toEqual(20);
        expect(product.category).toEqual("test category");
        expect(product.expiry_date).toEqual("2022-01-01");
      } catch (err) {
        console.log(err);
      }
    });
  });

  it("throws error for invalid collection name", async () => {
    const data = `invalid_collection_name,product_name,brand_name,cost_price,selling_
    price,category,expiry_date\n123,test product,test brand,10,20,test category,2022-01-01\n789,test product 2,test brand 2,15,25,test category 2,2022-02-01\n`;
    try {
      processAndStoreData(data);
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).toEqual(error.message);
    }
    const count = await Product.countDocuments();
    expect(count).toEqual(0);
  });

  it("throws error if the data is empty", async () => {
    try {
      processAndStoreData("");
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).toEqual("Data is empty");
    }
    const count = await Product.countDocuments();
    expect(count).toEqual(0);
  });

  it("throws error if the data is malformed", async () => {
    const data = `product_i,product_name,brand_name,cost_price,selling_price,category,expiry_date\n123,test product,test brand,10,20,test category\n789,test product 2,test brand 2,15,25,test category 2,2022-02-01\n`;
    try {
      processAndStoreData(data);
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).toEqual("Data is malformed");
    }
    try {
      const count = await Product.countDocuments();
      expect(count).toEqual(0);
    } catch (err) {
      console.log(err);
    }
  });
});
