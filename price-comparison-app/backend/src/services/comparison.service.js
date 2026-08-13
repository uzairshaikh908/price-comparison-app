const comparisonRepository = require("../repositories/comparison.repository");

const search = async (query) => {
  if (!query || typeof query !== "string") {
    throw new Error("Search query is required");
  }

  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw new Error("Search query is required");
  }

  const deals = [
    {
      source: "Amazon",
      originalPrice: 1000,
      discountPercent: 5,
      cashbackPercent: 2,

      paymentMethods: [
        {
          name: "HDFC Credit Card",
          benefit: 30,
        },
        {
          name: "ICICI Credit Card",
          benefit: 20,
        },
        {
          name: "UPI",
          benefit: 10,
        },
      ],
    },

    {
      source: "Flipkart",
      originalPrice: 980,
      discountPercent: 3,
      cashbackPercent: 4,

      paymentMethods: [
        {
          name: "HDFC Credit Card",
          benefit: 40,
        },
        {
          name: "ICICI Credit Card",
          benefit: 25,
        },
        {
          name: "UPI",
          benefit: 10,
        },
      ],
    },

    {
      source: "Reliance",
      originalPrice: 1020,
      discountPercent: 8,
      cashbackPercent: 1,

      paymentMethods: [
        {
          name: "HDFC Credit Card",
          benefit: 20,
        },
        {
          name: "ICICI Credit Card",
          benefit: 30,
        },
        {
          name: "UPI",
          benefit: 15,
        },
      ],
    },

    {
      source: "BigBasket",
      originalPrice: 990,
      discountPercent: 4,
      cashbackPercent: 3,

      paymentMethods: [
        {
          name: "HDFC Credit Card",
          benefit: 25,
        },
        {
          name: "ICICI Credit Card",
          benefit: 15,
        },
        {
          name: "UPI",
          benefit: 10,
        },
      ],
    },
  ];

  const normalizedDeals = deals.map((deal) => {
    const discountAmount = deal.originalPrice * (deal.discountPercent / 100);

    const finalPrice = deal.originalPrice - discountAmount;

    const cashbackAmount = finalPrice * (deal.cashbackPercent / 100);

    const effectivePrice = finalPrice - cashbackAmount;

    let bestPaymentMethod = "No Extra Benefit";

    let bestPaymentBenefit = 0;

    for (const payment of deal.paymentMethods) {
      if (payment.benefit > bestPaymentBenefit) {
        bestPaymentBenefit = payment.benefit;

        bestPaymentMethod = payment.name;
      }
    }

    const finalEffectivePrice = effectivePrice - bestPaymentBenefit;

    return {
      source: deal.source,

      originalPrice: deal.originalPrice,

      discountPercent: deal.discountPercent,

      cashbackPercent: deal.cashbackPercent,

      finalPrice: Number(finalPrice.toFixed(2)),

      cashbackAmount: Number(cashbackAmount.toFixed(2)),

      effectivePrice: Number(finalEffectivePrice.toFixed(2)),

      bestPaymentMethod,

      bestPaymentBenefit,
    };
  });

  let cheapestDeal = normalizedDeals[0];

  for (const deal of normalizedDeals) {
    if (deal.effectivePrice < cheapestDeal.effectivePrice) {
      cheapestDeal = deal;
    }
  }

  const finalDeals = normalizedDeals.map((deal) => {
    return {
      ...deal,

      isCheapest: deal.source === cheapestDeal.source,
    };
  });

  return {
    query: normalizedQuery,

    deals: finalDeals,

    cheapest: cheapestDeal,
  };
};

const save = async (userId, data) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!data) {
    throw new Error("Comparison data is required");
  }

  if (!data.query) {
    throw new Error("Query is required");
  }

  if (!Array.isArray(data.deals)) {
    throw new Error("Deals are required");
  }

  if (data.deals.length === 0) {
    throw new Error("At least one deal is required");
  }

  if (!data.cheapest) {
    throw new Error("Cheapest deal is required");
  }

  const bestSource = data.cheapest.source;

  const bestPrice = data.cheapest.finalPrice;

  const bestEffectivePrice = data.cheapest.effectivePrice;

  const bestPaymentMethod =
    data.cheapest.bestPaymentMethod || "No Extra Benefit";

  const comparisonId = await comparisonRepository.createComparison(
    userId,

    data.query,

    bestSource,

    bestPrice,

    bestPaymentMethod,

    bestEffectivePrice,
  );

  for (const deal of data.deals) {
    await comparisonRepository.createDeal(
      comparisonId,

      deal.source,

      deal.originalPrice,

      deal.discountPercent,

      deal.cashbackPercent,

      deal.finalPrice,

      deal.effectivePrice,

      deal.isCheapest,
    );
  }

  return {
    comparisonId,
  };
};

const getSaved = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const comparisons = await comparisonRepository.findByUserId(userId);

  for (const comparison of comparisons) {
    comparison.deals = await comparisonRepository.findDealsByComparisonId(
      comparison.id,
    );
  }

  return comparisons;
};

module.exports = {
  search,

  save,

  getSaved,
};
