const app = require("express")();
const request = require("supertest");

const mongoose = require("mongoose");

const Sale = require("../../models/Sale");
const Product = require("../../models/Product");

const { saleData, productData } = require("../testData");
const { expect } = require("chai");

jest.setTimeout(30000);

describe("GET /", () => {
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
    try {
      await Sale.deleteMany({});
      await Product.deleteMany({});
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      console.log(err);
    }
  });

  it("returns a status code of 200 and a JSON object containing the sales and products data when both collections have data", async () => {
    //insert data into Sale and Product database
    try {
      await Sale.insertMany(saleData);
      await Product.insertMany(productData);
    } catch (err) {
      console.log(err);
    }

    request(app)
      .get("/api/sales")
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          sales: saleData,
          products: productData,
        });
      })
      .catch((err) => {});
  });

  it("returns a status code of 200 and a JSON object containing only the sales data when only the sales collection has data", async () => {
    try {
      await Sale.insertMany(saleData);
    } catch (err) {
      console.log(err);
    }
    request(app)
      .get("/")
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          result: {
            sales: saleData,
          },
        });
      })
      .catch((err) => {});
  });

  it("returns a status code of 200 and a JSON object containing only the product data when only the product collection has data", async () => {
    try {
      await Product.insertMany(productData);
    } catch (err) {
      console.log(err);
    }
    request(app)
      .get("/")
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          result: {
            products: productData,
          },
        });
      })
      .catch((err) => {});
  });

  it('should return a 404 status and a "No data found" message if no data exists', async () => {
    request(app)
      .get("/api/sales/")
      .then((res) => {
        expect(res.status).toEqual(404);
        expect(res.body).toEqual({
          message: "No data found",
        });
      })
      .catch((err) => {});
  });
});

describe("GET /api/sales/sales-by-product", () => {
  beforeEach(async () => {
    const testSales = [
      {
        transaction_id: "1",
        product_id: "123",
        quantity: 2,
        total_transaction_amount: 10.99,
        transaction_date: "2022/01/01",
      },
      {
        transaction_id: "2",
        product_id: "456",
        quantity: 3,
        total_transaction_amount: 20.99,
        transaction_date: "2022/02/01",
      },
      {
        transaction_id: "3",
        product_id: "123",
        quantity: 1,
        total_transaction_amount: 5.99,
        transaction_date: "2022/03/01",
      },
    ];

    const testProducts = [
      {
        product_id: "123",
        product_name: "Product 1",
        brand_name: "Brand 1",
        cost_price: 5,
        selling_price: 10,
        category: "cat 1",
        expiry_date: "2023/06/21",
      },
      {
        product_id: "456",
        product_name: "Product 2",
        brand_name: "Brand 2",
        cost_price: 7,
        selling_price: 10,
        category: "cat 2",
        expiry_date: "2023/05/21",
      },
    ];
    try {
      await Sale.create(testSales);
      await Product.create(testProducts);
    } catch (error) {}
  });

  afterEach(async () => {
    try {
      await Sale.deleteMany({});
      await Product.deleteMany({});
    } catch (err) {}
  });

  it("should return a 200 status and the sales data grouped by product", async () => {
    request(app)
      .get("/api/sales/sales-by-product")
      .then((res) => {
        //Expected response
        const expectedResult = {
          result: [
            {
              0: {
                productId: "123",
                productName: "Product 1",
                brandName: "Brand 1",
                category: "cat 1",
                totalQuantitySold: 3,
                totalRevenue: 16.98,
                totalProfit: 4.98,
              },
            },
            {
              1: {
                productId: "456",
                productName: "Product 2",
                brandName: "Brand 2",
                category: "cat 2",
                totalQuantitySold: 3,
                totalRevenue: 20.99,
                totalProfit: 8.97,
              },
            },
          ],
          mostProfitableProduct: {
            productId: "456",
            productName: "Product 2",
            brandName: "Brand 2",
            category: "cat 2",
            totalQuantitySold: 3,
            totalRevenue: 20.99,
            totalProfit: 8.97,
          },
          leastProfitableProduct: {
            productId: "123",
            productName: "Product 1",
            brandName: "Brand 1",
            category: "cat 1",
            totalQuantitySold: 3,
            totalRevenue: 16.98,
            totalProfit: 4.98,
          },
        };
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expectedResult);
      })
      .catch((err) => {});
  });

  it("returns the most and least profitable products based on sales data", () => {
    request(app)
      .get("/api/sales/sales-by-product")
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("mostProfitableProduct", {
          productId: "456",
          productName: "Product 2",
          brandName: "Brand 2",
          category: "cat 2",
          totalQuantitySold: 3,
          totalRevenue: 20.99,
          totalProfit: 8.97,
        }),
          expect(res.body).toHaveProperty("leastProfitableProduct", {
            leastProfitableProduct: {
              productId: "123",
              productName: "Product 1",
              brandName: "Brand 1",
              category: "cat 1",
              totalQuantitySold: 3,
              totalRevenue: 16.98,
              totalProfit: 4.98,
            },
          });
      })
      .catch((err) => {});
  });

  it("Should return 404 if one or both the collections are empty i.e Sale and Product", async () => {
    try {
      await Product.deleteMany();
    } catch (err) {}
    request(app)
      .get("/api/sales/sales-by-product")
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual({
          message:
            "Cannot perform operation. One or both the collections are empty",
        });
      })
      .catch((err) => {});
  });
});

describe("GET /api/sales/sales-by-brand", () => {
  beforeEach(async () => {
    const testSales = [
      {
        transaction_id: "1",
        product_id: "1",
        quantity: 5,
        total_transaction_amount: 500.0,
        transaction_date: "2022-01-01",
      },
      {
        transaction_id: "2",
        product_id: "2",
        quantity: 5,
        total_transaction_amount: 500.0,
        transaction_date: "2022-02-01",
      },
    ];

    const testProducts = [
      {
        product_id: "1",
        product_name: "foo",
        brand_name: "bar",
        category: "baz",
        cost_price: 50,
        selling_price: 75,
        expiry_date: "2022-02-04",
      },
      {
        product_id: "2",
        product_name: "qux",
        brand_name: "quux",
        category: "corge",
        cost_price: 20,
        selling_price: 50,
        expiry_date: "2022-03-05",
      },
    ];

    try {
      await Sale.create(testSales);
      await Product.create(testProducts);
    } catch (error) {}
  });

  afterEach(async () => {
    try {
      await Sale.deleteMany({});
      await Product.deleteMany({});
    } catch (error) {}
  });

  it("should return a 200 status and the sales data grouped by brand", async () => {
    request(app)
      .get("/api/sales/sales-by-brand")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
          0: {
            brandName: "bar",
            totalQuantitySold: 5,
            totalRevenue: 500,
            totalProfit: 250,
            mostSoldProduct: "baz",
            mostSoldProductQuantity: 5,
          },
          1: {
            brandName: "qux",
            totalQuantitySold: 5,
            totalRevenue: 500,
            totalProfit: 400,
            mostSoldProduct: "corge",
            mostSoldProductQuantity: 5,
          },
        });
      })
      .catch((err) => {});
  });

  it("Should return 404 if one or both the collections(Sale and Product) are empty", async () => {
    try {
      await Sale.deleteMany({});
    } catch (error) {}
    request(app)
      .get("/api/sales/sales-by-brand")
      .then((response) => {
        expect(response.statusCode).toEqual(404);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toEqual({
          message:
            "Cannot perform operation. One or both the collections are empty",
        });
      })
      .catch((err) => {});
  });
});

describe("GET /api/sales/highest-lowest-sales", () => {
  afterEach(async () => {
    try {
      await Sale.deleteMany({});
      await Product.deleteMany({});
    } catch (error) {}
  });

  it("Should return the highest-lowest sales with status code 200", async () => {
    const testSales = [
      {
        transaction_id: "1",
        product_id: "1",
        quantity: 2,
        total_transaction_amount: 600,
        transaction_date: "2022/01/01",
      },
      {
        transaction_id: "2",
        product_id: "2",
        quantity: 3,
        total_transaction_amount: 500,
        transaction_date: "2022/02/01",
      },
    ];

    const testProducts = [
      {
        product_id: "1",
        product_name: "foo",
        brand_name: "bar",
        cost_price: 50,
        selling_price: 75,
        category: "cat 1",
        expiry_date: "2024/01/01",
      },
      {
        product_id: "2",
        product_name: "qux",
        brand_name: "bar",
        cost_price: 25,
        selling_price: 50,
        category: "cat 2",
        expiry_date: "2024/02/01",
      },
    ];

    try {
      await Sale.create(testSales);
      await Product.create(testProducts);
    } catch (error) {}

    request(app)
      .get("/api/sales/highest-lowest-sales")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
          highestSales: {
            date: "2022/02/01",
            totalSales: 600,
            products: [
              {
                productId: "1",
                productName: "foo",
                brandName: "bar",
                category: "foo",
                quantitySold: 5,
                totalTransactionAmount: 600,
              },
            ],
          },
          lowestSales: {
            date: "2022/01/01",
            totalSales: 500,
            products: [
              {
                productId: "1",
                productName: "foo",
                brandName: "bar",
                category: "foo",
                quantitySold: 2,
                totalTransactionAmount: 500,
              },
            ],
          },
        });
      })
      .catch((error) => {});
  });

  it("should return a 200 status and the correct highest and lowest sales when there are multiple sales on the same date", async () => {
    const testSales = [
      {
        transaction_id: "1",
        product_id: "1",
        quantity: 2,
        total_transaction_amount: 500,
        transaction_date: "2022/01/01",
      },
      {
        transaction_id: "2",
        product_id: "2",
        quantity: 3,
        total_transaction_amount: 500,
        transaction_date: "2022/01/01",
      },
      {
        transaction_id: "3",
        product_id: "3",
        quantity: 5,
        total_transaction_amount: 600,
        transaction_date: "2022/01/03",
      },
    ];

    const testProducts = [
      {
        product_id: "1",
        product_name: "foo",
        brand_name: "bar",
        cost_price: 50,
        selling_price: 75,
        category: "cat 1",
        expiry_date: "2024/01/01",
      },
      {
        product_id: "2",
        product_name: "qux",
        brand_name: "bar",
        cost_price: 25,
        selling_price: 50,
        category: "cat 2",
        expiry_date: "2024/02/01",
      },
      {
        product_id: "3",
        product_name: "baz",
        brand_name: "qux",
        cost_price: 30,
        selling_price: 60,
        category: "cat 3",
        expiry_date: "2024/03/01",
      },
    ];

    try {
      await Sale.create(testSales);
      await Product.create(testProducts);
    } catch (error) {}

    request(app)
      .get("/api/sales/highest-lowest-sales")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
          highestSales: {
            date: "2022/01/01",
            totalSales: 1000,
            products: [
              {
                productId: "1",
                productName: "foo",
                brandName: "bar",
                category: "cat 1",
                quantitySold: 2,
                totalTransactionAmount: 500,
              },
              {
                productId: "2",
                productName: "qux",
                brandName: "bar",
                category: "cat 2",
                quantitySold: 3,
                totalTransactionAmount: 500,
              },
            ],
          },
          lowestSales: {
            date: "2022/01/03",
            totalSales: 600,
            products: [
              {
                productId: "1",
                productName: "baz",
                brandName: "cux",
                category: "cat 3",
                quantitySold: 5,
                totalTransactionAmount: 600,
              },
            ],
          },
        });
      })
      .catch((err) => {});
  });

  it("Should return 404 if Sale collection or Product collection is empty", () => {
    request(app)
      .get("/api/sales/highest-lowest-sales")
      .then((response) => {
        expect(response.statusCode).toEqual(404);
        expect(response.body).taHaveProperty("message");
        expect(response.body.message).toEqual({
          message:
            "Cannot perform operation. One or both the collections are empty",
        });
      })
      .catch((err) => {});
  });
});
