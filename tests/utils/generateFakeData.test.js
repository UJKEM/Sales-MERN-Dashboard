const fs = require("fs");
const path = require("path");

const generateFakeData = require("../../utils/generateFakeData");

describe("generateFakeData", () => {
  beforeEach(() => {
    // Clear the data and sales directories before each test
    if (fs.existsSync(path.join(process.cwd(), "data"))) {
      fs.rmdirSync(path.join(process.cwd(), "data"), { recursive: true });
    }
  });

  it("creates the data and sales directories if they do not exist", () => {
    generateFakeData();
    expect(fs.existsSync(process.cwd(), "data")).toBe(true);
    expect(fs.existsSync(process.cwd(), "data", "sales")).toBe(true);
  });

  it("generates the specified number of sales files", async () => {
    generateFakeData();
    setTimeout(() => {
      const salesDir = path.join(process.cwd(), "data", "sales");
      const saleFiles = fs.readdirSync(salesDir);
      expect(saleFiles.length).toBe(20);
      saleFiles.forEach((file) => {
        expect(file).toMatch(/sales_\d+.csv/);
      });
    });
  });

  it("generates the specified number of products files", () => {
    generateFakeData();
    setTimeout(() => {
      const productsDir = path.join(process.cwd(), "data", "products");
      fs.readdir(productsDir, (err, files) => {
        expect(files.length).toBe(10);
        files.forEach((file) => {
          expect(file).toMatch(/products_\d+.csv/);
        });
      });
    });
  });

  it("generates the correct number of rows in each sales file", () => {
    generateFakeData();
    const salesDir = path.join(process.cwd(), "data", "sales");
    const salesFiles = fs.readdirSync(salesDir);
    salesFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(salesDir, file), "utf-8");
      const rows = data.split("\n");
      expect(rows.length - 1).toBe(100); // minus 1 for the header row
    });
  });

  it("generates the correct number of rows in each products file", () => {
    generateFakeData();
    const productsDir = path.join(process.cwd(), "data", "products");
    const productsFiles = fs.readdirSync(productsDir);
    productsFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(productsDir, file), "utf-8");
      const rows = data.split("\n");
      expect(rows.length - 1).toBe(10); // minus 1 for the header row
    });
  });

  it("generates unique transaction IDs in each sales file", () => {
    generateFakeData();
    const salesDir = path.join(process.cwd(), "data", "sales");
    const salesFiles = fs.readdirSync(salesDir);
    const transactionIds = new Set();
    salesFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(salesDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const transactionId = rows[i].split(",")[0];
        expect(transactionIds.has(transactionId)).toBe(false);
        transactionIds.add(transactionId);
      }
    });
  });

  it("generates data in the correct format", () => {
    generateFakeData();
    const salesDir = path.join(process.cwd(), "data", "sales");
    const salesFiles = fs.readdirSync(salesDir);
    salesFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(salesDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const columns = rows[i].split(",");
        expect(columns[0]).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        ); // check that transaction_id is a valid GUID
        expect(columns[1]).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        ); // check that product_id is a valid GUID
        expect(parseInt(columns[2])).toBeGreaterThanOrEqual(1); // check that quantity is a valid integer
        expect(parseFloat(columns[3])).toBeGreaterThan(0); // check that total_
        expect(new Date(columns[4])).toBeTruthy(); // check that transaction_date is a valid date
      }
    });
  });
  it("generates unique product IDs in each product file", () => {
    generateFakeData();
    const productsDir = path.join(process.cwd(), "data", "products");
    const productFiles = fs.readdirSync(productsDir);
    const productIds = new Set();
    productFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(productsDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const productId = rows[i].split(",")[0];
        expect(productIds.has(productId)).toBe(false);
        productIds.add(productId);
      }
    });
  });

  it("generates products with expiry date in future", () => {
    generateFakeData();
    const productsDir = path.join(process.cwd(), "data", "products");
    const productFiles = fs.readdirSync(productsDir);
    productFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(productsDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const expiryDate = new Date(rows[i].split(",")[6]);
        expect(expiryDate).toBeGreaterThan(new Date());
      }
    });
  });

  it("generates products with selling price greater than cost price", () => {
    generateFakeData();
    const productsDir = path.join(process.cwd(), "data", "products");
    const productFiles = fs.readdirSync(productsDir);
    productFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(productsDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const costPrice = parseFloat(rows[i].split(",")[4]);
        const sellingPrice = parseFloat(rows[i].split(",")[5]);
        expect(sellingPrice).toBeGreaterThan(costPrice);
      }
    });
  });

  it("generates products with valid categories", () => {
    generateFakeData();
    const productsDir = path.join(process.cwd(), "data", "products");
    const productFiles = fs.readdirSync(productsDir);
    const categories = [
      "Electronics",
      "Home and Kitchen",
      "Clothing and Accessories",
      "Beauty and Personal Care",
      "Books and Audible",
      "Automotive",
      "Toys and Games",
      "Sports and Outdoors",
      "Health and Wellness",
      "Grocery and Gourmet Food",
      "Baby",
      "Pet Supplies",
      "Office Products",
      "Musical Instruments",
      "Industrial and Scientific",
      "Craft and Hobbies",
    ];
    productFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(productsDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const category = rows[i].split(",")[6];
        expect(categories.includes(category)).toBeTruthy();
      }
    });
  });

  it("generates products with unique product names and brand names", () => {
    generateFakeData();
    const productsDir = path.join(process.cwd(), "data", "products");
    const productFiles = fs.readdirSync(productsDir);
    const productNames = new Set();
    const brandNames = new Set();
    productFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(productsDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const productName = rows[i].split(",")[2];
        const brandName = rows[i].split(",")[3];
        expect(productNames.has(productName)).toBe(false);
        expect(brandNames.has(brandName)).toBe(false);
        productNames.add(productName);
        brandNames.add(brandName);
      }
    });
  });

  it("generates products with valid expiry date", () => {
    generateFakeData();
    const productsDir = path.join(process.cwd(), "data", "products");
    const productFiles = fs.readdirSync(productsDir);
    productFiles.forEach((file) => {
      const data = fs.readFileSync(path.join(productsDir, file), "utf-8");
      const rows = data.split("\n");
      for (let i = 1; i < rows.length; i++) {
        // start from 1 to skip the header row
        const expiryDate = new Date(rows[i].split(",")[7]);
        expect(expiryDate instanceof Date && !isNaN(expiryDate)).toBeTruthy();
      }
    });
  });
});
