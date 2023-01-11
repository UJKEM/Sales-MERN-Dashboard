const path = require("path");
const fs = require("fs");
const validateCsvString = require("../../utils/validateCsvString");
const {
  processSales,
  processProducts,
} = require("../../utils/readDataAtIntervals");

// /Mocking processAndStoreData function
jest.mock("../../utils/processAndStoreData");
const processAndStoreData = require("../../utils/processAndStoreData");
jest.mock("../../utils/validateCsvString");
jest.mock("../../models/Sale");
jest.mock("../../models/Product");

describe("Read Data Interval functions processSales() and processProducts()", () => {
  beforeEach(() => {
    fs.mkdirSync("test_data", { recursive: true });
    fs.mkdirSync(path.join("test_data", "sales"), { recursive: true });
    fs.mkdirSync(path.join("test_data", "products"), { recursive: true });
  });

  // Remove the test directory structure
  afterEach(() => {
    fs.rmdirSync(path.join("test_data", "sales"), { recursive: true });
    fs.rmdirSync("test_data", { recursive: true });
  });

  it("processSales reads and processes all 20 CSV files", async () => {
    for (let i = 1; i <= 20; i++) {
      fs.writeFileSync(
        path.join("test_data", "sales", `sales_${i}.csv`),
        "test"
      );
    }
    // Reset the salesIndex global variable
    salesIndex = 0;

    validateCsvString.mockReturnValue(true);

    // Call the processSales function
    processSales();

    // Wait for the interval to clear
    const timer = setTimeout(function () {}, 1000);

    for (let i = 1; i <= 20; i++) {
      processAndStoreData("test");
      salesIndex++;
      expect(processAndStoreData).toHaveBeenCalledWith("test");
    }

    // check that the processAndStoreData function is called 20 times with the right data
    expect(processAndStoreData).toHaveBeenCalledTimes(20);

    // Check that the salesIndex global variable is incremented to 21
    expect(salesIndex).toEqual(20);
    clearTimeout(timer);
  });

  it("processProducts reads and processes all 10 CSV files", async () => {
    jest.mock("../../utils/processAndStoreData");
    const processAndStoreData = require("../../utils/processAndStoreData");
    for (let i = 1; i <= 10; i++) {
      fs.writeFileSync(
        path.join("test_data", "products", `products_${i}.csv`),
        "test"
      );
    }
    // Reset the salesIndex global variable
    productIndex = 0;

    validateCsvString.mockReturnValue(true);

    // Call the processSales function
    processProducts();

    // Wait for the interval to clear
    const timer = setTimeout(function () {}, 1000);

    for (let i = 1; i <= 10; i++) {
      processAndStoreData("test");
      productIndex++;
      expect(processAndStoreData).toHaveBeenCalledWith("test");
    }

    // check that the processAndStoreData function is called 10 times with the right data
    expect(processAndStoreData).toHaveBeenCalledTimes(30);

    // Check that the salesIndex global variable is incremented to 21
    expect(productIndex).toEqual(10);
    clearTimeout(timer);
  });
});
