const pool = require("../config/db");

const createComparison = async (
  userId,
  queryText,
  bestSource,
  bestPrice,
  bestPaymentMethod,
  bestEffectivePrice,
) => {
  const [result] = await pool.execute(
    `
        INSERT INTO comparisons
        (
            user_id,
            query_text,
            best_source,
            best_price,
            best_payment_method,
            best_effective_price
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,

    [
      userId,
      queryText,
      bestSource,
      bestPrice,
      bestPaymentMethod,
      bestEffectivePrice,
    ],
  );

  return result.insertId;
};

const createDeal = async (
  comparisonId,
  source,
  originalPrice,
  discountPercent,
  cashbackPercent,
  finalPrice,
  effectivePrice,
  isCheapest,
) => {
  const [result] = await pool.execute(
    `
        INSERT INTO deals
        (
            comparison_id,
            source,
            original_price,
            discount_percent,
            cashback_percent,
            final_price,
            effective_price,
            is_cheapest
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,

    [
      comparisonId,
      source,
      originalPrice,
      discountPercent,
      cashbackPercent,
      finalPrice,
      effectivePrice,
      isCheapest,
    ],
  );

  return result.insertId;
};

const findByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `
        SELECT
            id,
            user_id,
            query_text,
            best_source,
            best_price,
            best_payment_method,
            best_effective_price,
            created_at
        FROM comparisons
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,

    [userId],
  );

  return rows;
};

const findDealsByComparisonId = async (comparisonId) => {
  const [rows] = await pool.execute(
    `
        SELECT
            id,
            comparison_id,
            source,
            original_price,
            discount_percent,
            cashback_percent,
            final_price,
            effective_price,
            is_cheapest
        FROM deals
        WHERE comparison_id = ?
        ORDER BY effective_price ASC
        `,

    [comparisonId],
  );

  return rows;
};

module.exports = {
  createComparison,

  createDeal,

  findByUserId,

  findDealsByComparisonId,
};
