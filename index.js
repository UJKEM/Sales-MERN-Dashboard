const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//Package to connect to the database
const mongoose = require("mongoose");

const cors = require("cors");

const morgan = require("morgan");

const helmet = require("helmet");

const generateFakeData = require("./utils/generateFakeData");

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

// 404 middleware
app.use((req, res, next) => {
  const error = new Error("404: Not Found");
  error.status = 404;
  next(error);
});

// Error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      //Generate Fake Data and start processing it into MongoDB
      generateFakeData();
      processSales();
      processProducts();
    });
  })
  .catch((error) => {
    console.error(error);
  });
