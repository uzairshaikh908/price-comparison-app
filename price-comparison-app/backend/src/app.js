const express = require("express");
const cors = require("cors");

const authRoutes = require("../src/routes/auth.routes");
const comparisonRoutes = require("../src/routes/comparison.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/comparisons", comparisonRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Price",
  });
});

module.exports = app;
