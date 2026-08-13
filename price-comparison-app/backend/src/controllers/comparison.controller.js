const comparisonService = require("../services/comparison.service");

const search = async (req, res) => {
  try {
    const { query } = req.body;

    const result = await comparisonService.search(query);

    return res.status(200).json({
      success: true,
      message: "Comparison completed successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const save = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await comparisonService.save(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Comparison saved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSaved = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await comparisonService.getSaved(userId);

    return res.status(200).json({
      success: true,
      message: "Saved comparisons fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  search,
  save,
  getSaved,
};
