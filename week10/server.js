"use strict";

const express = require("express");
const logger = require("./middleware/logger");
const timing = require("./middleware/timing");
const apiKeyAuth = require("./middleware/apiKeyAuth");
const productsRoutes = require("./routes/products");
const customersRoutes = require("./routes/customers");
const tasksRoutes = require("./routes/tasks");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use(timing);
app.use(apiKeyAuth);

app.use("/products", productsRoutes);
app.use("/customers", customersRoutes);
app.use("/tasks", tasksRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
