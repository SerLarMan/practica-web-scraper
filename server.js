require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/utils/database");
const productRoutes = require("./src/api/routes/product.route");

// Conexión a la base de datos
connectDB();

// Configuración del servidor
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/products", productRoutes);

app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  return res
    .status(error.status || 500)
    .json(error.message || "Unexpected error");
});

module.exports = app;
