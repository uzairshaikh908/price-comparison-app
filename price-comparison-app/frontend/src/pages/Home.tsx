import { useEffect, useState } from "react";
import {
  FiLogOut,
  FiSearch,
  FiTag,
  FiBookmark,
  FiCreditCard,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  saveComparison,
  searchComparison,
} from "../services/api";

import "./Home.css";

type Deal = {
  source: string;
  originalPrice: number;
  discountPercent: number;
  cashbackPercent: number;
  finalPrice: number;
  cashbackAmount?: number;
  effectivePrice: number;
  isCheapest: boolean;
  bestPaymentMethod: string;
  bestPaymentBenefit: number;
};

type ComparisonResult = {
  query: string;
  deals: Deal[];
  cheapest: Deal;
};

const Home = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [result, setResult] =
    useState<ComparisonResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [paymentFilter, setPaymentFilter] =
    useState("All");

  useEffect(() => {
    const searchQuery = query.trim();

    if (!searchQuery) {
      setResult(null);
      setError("");
      setSaveMessage("");
      setSaveError("");
      setPaymentFilter("All");
      return;
    }

    const timer = setTimeout(() => {
      searchProduct(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const searchProduct = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError("");
      setSaveMessage("");
      setSaveError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again");
        return;
      }

      const response = await searchComparison(
        searchQuery,
        token
      );

      setResult(response.data);
      setPaymentFilter("All");
    } catch (error: any) {
      setResult(null);

      setError(
        error.response?.data?.message ||
          "Unable to compare prices"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComparison = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSaveError("Please login again");
        return;
      }

      if (!result) {
        return;
      }

      setSaving(true);
      setSaveMessage("");
      setSaveError("");

      const response = await saveComparison(
        {
          query: result.query,
          deals: result.deals,
          cheapest: result.cheapest,
        },
        token
      );

      setSaveMessage(
        response.message ||
          "Comparison saved successfully"
      );
    } catch (error: any) {
      setSaveError(
        error.response?.data?.message ||
          "Unable to save comparison"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  const formatPrice = (price: number) => {
    return `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const paymentMethods = result
    ? Array.from(
        new Set(
          result.deals
            .map((deal) => deal.bestPaymentMethod)
            .filter(Boolean)
        )
      )
    : [];

  const filteredDeals =
    result && paymentFilter !== "All"
      ? result.deals.filter(
          (deal) =>
            deal.bestPaymentMethod === paymentFilter
        )
      : result?.deals || [];

  return (
    <main className="home-page">

      <header className="home-header">
        <div className="container home-header-inner">

          <div className="home-logo">
            Price
          </div>

          <nav className="home-nav">

            <button
              type="button"
              className="home-saved"
              onClick={() => navigate("/saved")}
            >
              <FiBookmark />
              Saved Comparisons
            </button>

            <button
              type="button"
              className="home-logout"
              onClick={handleLogout}
            >
              <FiLogOut />
              Logout
            </button>

          </nav>

        </div>
      </header>

      <section className="home-hero">

        <div className="container">

          <div className="home-content">

            <p className="home-eyebrow">
              SMART PRICE COMPARISON
            </p>

            <h1>
              Find the
              <br />
              <span>best price.</span>
            </h1>

            <p className="home-description">
              Search for a product and compare
              prices, discounts and cashback
              across different sources.
            </p>

            <div className="home-search">

              <FiSearch className="home-search-icon" />

              <input
                type="text"
                value={query}
                placeholder="Search for a product..."
                onChange={(event) => {
                  setQuery(event.target.value);
                  setError("");
                  setSaveMessage("");
                  setSaveError("");
                }}
              />

              {loading && (
                <span className="home-loading">
                  Searching...
                </span>
              )}

            </div>

            {error && (
              <p className="home-error">
                {error}
              </p>
            )}

          </div>

        </div>

      </section>

      {result && (

        <section className="home-results">

          <div className="container">

            <div className="home-results-heading">

              <div>
                <p className="home-eyebrow">
                  COMPARISON RESULT
                </p>

                <h2>
                  {result.query}
                </h2>
              </div>

              <span className="home-count">
                {result.deals.length} deals found
              </span>

            </div>

            <div className="best-deal">

              <div>

                <div className="best-deal-label">
                  <FiTag />
                  BEST PRICE
                </div>

                <h3>
                  {result.cheapest.source}
                </h3>

                <p>
                  Lowest price found for this product
                </p>

              </div>

              <div className="best-price">

                <span>
                  Effective price
                </span>

                <strong>
                  {formatPrice(
                    result.cheapest.effectivePrice
                  )}
                </strong>

              </div>

            </div>

            <div className="comparison-controls">

              <div className="best-payment">

                <div className="best-payment-icon">
                  <FiCreditCard />
                </div>

                <div>
                  <span>
                    Best Payment Method
                  </span>

                  <strong>
                    {result.cheapest.bestPaymentMethod}
                  </strong>
                </div>

              </div>

              <div className="filter-control">

                <label htmlFor="payment-filter">
                  Payment Method
                </label>

                <select
                  id="payment-filter"
                  value={paymentFilter}
                  onChange={(event) =>
                    setPaymentFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Payment Methods
                  </option>

                  {paymentMethods.map((method) => (
                    <option
                      key={method}
                      value={method}
                    >
                      {method}
                    </option>
                  ))}
                </select>

              </div>

              <button
                type="button"
                className="save-comparison-button"
                onClick={handleSaveComparison}
                disabled={saving}
              >
                <FiBookmark />

                {saving
                  ? "Saving..."
                  : "Save Comparison"}
              </button>

            </div>

            {saveMessage && (
              <p className="save-success">
                {saveMessage}
              </p>
            )}

            {saveError && (
              <p className="save-error">
                {saveError}
              </p>
            )}

            {filteredDeals.length > 0 ? (

              <div className="deals-grid">

                {filteredDeals.map((deal) => (

                  <article
                    key={deal.source}
                    className={`deal-card ${
                      deal.isCheapest
                        ? "deal-card-best"
                        : ""
                    }`}
                  >

                    <div className="deal-header">

                      <div>
                        <h3>
                          {deal.source}
                        </h3>

                        {deal.isCheapest && (
                          <span className="deal-badge">
                            Cheapest
                          </span>
                        )}
                      </div>

                    </div>

                    <div className="deal-main-price">

                      <span>
                        Final price
                      </span>

                      <strong>
                        {formatPrice(
                          deal.finalPrice
                        )}
                      </strong>

                    </div>

                    <div className="deal-info">

                      <div>
                        <span>
                          Original Price
                        </span>

                        <strong>
                          {formatPrice(
                            deal.originalPrice
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Discount
                        </span>

                        <strong>
                          {deal.discountPercent}%
                        </strong>
                      </div>

                      <div>
                        <span>
                          Cashback
                        </span>

                        <strong>
                          {deal.cashbackPercent}%
                        </strong>
                      </div>

                    </div>

                    <div className="deal-effective">

                      <span>
                        Effective price
                      </span>

                      <strong>
                        {formatPrice(
                          deal.effectivePrice
                        )}
                      </strong>

                    </div>

                    <div className="deal-payment">

                      <span>
                        Best payment method
                      </span>

                      <strong>
                        {deal.bestPaymentMethod}
                      </strong>

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              <div className="no-deals">
                No deals found for this payment method.
              </div>

            )}

          </div>

        </section>

      )}

    </main>
  );
};

export default Home;