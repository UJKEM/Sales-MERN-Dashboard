const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");

const morgan = require("morgan");

const helmet = require("helmet");

//!Cross Origin Resource Sharing
app.use(cors());

//Critical security middleware
app.use(helmet());

//Logging middleware
app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("listening on port ", port);
});
