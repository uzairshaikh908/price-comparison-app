import { useEffect, useState } from "react";
import { FiArrowLeft, FiTag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { getSavedComparisons } from "../services/api";

import "./Saved.css";

type Deal = {
  id: number;
  comparison_id: number;
  source: string;
  original_price: string;
  discount_percent: string;
  cashback_percent: string;
  final_price: string;
  effective_price: string;
  is_cheapest: number;
};

type SavedComparison = {
  id: number;
  user_id: number;
  query_text: string;
  best_source: string;
  best_price: string;
  best_payment_method: string;
  best_effective_price: string;
  created_at: string;
  deals: Deal[];
};

const Saved = () => {
  const navigate = useNavigate();

  const [comparisons, setComparisons] = useState<
    SavedComparison[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedComparisons = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await getSavedComparisons(token);

        setComparisons(response.data || []);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Unable to load saved comparisons"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavedComparisons();
  }, [navigate]);

  const formatPrice = (price: string) => {
    return `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="saved-page">
      <header className="saved-header">
        <div className="container saved-header-inner">
          <button
            type="button"
            className="saved-back"
            onClick={() => navigate("/")}
          >
            <FiArrowLeft />
            Back to Home
          </button>
        </div>
      </header>

      <section className="saved-content">
        <div className="container">
          <div className="saved-title">
            <p className="home-eyebrow">
              YOUR SAVED COMPARISONS
            </p>

            <h1>Saved Comparisons</h1>

            <p>
              View your previously saved price
              comparisons.
            </p>
          </div>

          {loading && (
            <div className="saved-state">
              <p>Loading saved comparisons...</p>
            </div>
          )}

          {!loading && error && (
            <div className="saved-state saved-state-error">
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            comparisons.length === 0 && (
              <div className="saved-state">
                <FiTag />

                <h2>No saved comparisons</h2>

                <p>
                  Search for a product and save a
                  comparison to see it here.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Start Comparing
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            comparisons.length > 0 && (
              <div className="saved-list">
                {comparisons.map((comparison) => (
                  <article
                    key={comparison.id}
                    className="saved-card"
                  >
                    <div className="saved-card-header">
                      <div>
                        <p>
                          Saved on{" "}
                          {formatDate(
                            comparison.created_at
                          )}
                        </p>

                        <h2>
                          {comparison.query_text}
                        </h2>
                      </div>

                      <span className="saved-best-badge">
                        <FiTag />
                        Best Price
                      </span>
                    </div>

                    <div className="saved-best">
                      <div>
                        <span>Best source</span>
                        <strong>
                          {comparison.best_source}
                        </strong>
                      </div>

                      <div>
                        <span>Final price</span>
                        <strong>
                          {formatPrice(
                            comparison.best_price
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Effective price</span>
                        <strong>
                          {formatPrice(
                            comparison.best_effective_price
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Payment method</span>
                        <strong>
                          {
                            comparison.best_payment_method
                          }
                        </strong>
                      </div>
                    </div>

                    <div className="saved-deals">
                      <h3>Compared Deals</h3>

                      <div className="saved-deals-grid">
                        {comparison.deals.map((deal) => (
                          <div
                            key={deal.id}
                            className={`saved-deal ${
                              deal.is_cheapest
                                ? "saved-deal-best"
                                : ""
                            }`}
                          >
                            <div className="saved-deal-top">
                              <strong>
                                {deal.source}
                              </strong>

                              {deal.is_cheapest === 1 && (
                                <span>
                                  Cheapest
                                </span>
                              )}
                            </div>

                            <div className="saved-deal-price">
                              <span>
                                Final price
                              </span>

                              <strong>
                                {formatPrice(
                                  deal.final_price
                                )}
                              </strong>
                            </div>

                            <div className="saved-deal-details">
                              <div>
                                <span>
                                  Original
                                </span>

                                <strong>
                                  {formatPrice(
                                    deal.original_price
                                  )}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Discount
                                </span>

                                <strong>
                                  {
                                    deal.discount_percent
                                  }
                                  %
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Cashback
                                </span>

                                <strong>
                                  {
                                    deal.cashback_percent
                                  }
                                  %
                                </strong>
                              </div>
                            </div>

                            <div className="saved-effective">
                              <span>
                                Effective price
                              </span>

                              <strong>
                                {formatPrice(
                                  deal.effective_price
                                )}
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default Saved;