const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const generateFakeData = require("./utils/generateFakeData");

//Package to connect to the database
const mongoose = require("mongoose");

const cors = require("cors");

const morgan = require("morgan");

const helmet = require("helmet");

const {
  processSales,
  processProducts,
} = require("./utils/readDataAtIntervals");

//!Cross Origin Resource Sharing
app.use(cors());

//Critical security middleware
app.use(helmet());

//Logging middleware
app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Open http://localhost:${port}/ in your browser`);
      generateFakeData();
      setInterval(processSales, 60 * 1000);
      setInterval(processProducts, 90 * 1000);
    });
  });
