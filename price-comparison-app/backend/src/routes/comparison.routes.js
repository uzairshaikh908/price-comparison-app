const express = require("express");

const router = express.Router();

const comparisonController = require("../controllers/comparison.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/search", authMiddleware, comparisonController.search);
router.post("/save", authMiddleware, comparisonController.save);
router.get("/saved", authMiddleware, comparisonController.getSaved);

module.exports = router;
