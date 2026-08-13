import { useState } from "react";
import type { FormEvent } from "react";
import {
  FiMail,
  FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      return "Email is required";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email";
    }

    if (!password.trim()) {
      return "Password is required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(
        email.trim(),
        password
      );

      console.log("Register response:", response);

      setSuccess(
        response.data?.message ||
        "Registration successful"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error: any) {
      console.log("Register error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-container">

        <section className="register-card">

          <div className="register-header">

            <div className="register-logo">
              Price
            </div>

            <p className="register-label">
              SAVE MORE
            </p>

            <h1>
              Create your
              <br />
              account
            </h1>

            <p className="register-description">
              Compare prices, find better deals and
              save your comparisons.
            </p>

          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            <div className="register-field">

              <label htmlFor="email">
                Email
              </label>

              <div className="register-input-wrapper">

                <FiMail />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={loading}
                />

              </div>

            </div>

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">

                <FiLock />

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={loading}
                />

              </div>

            </div>

            {error && (
              <p className="register-error">
                {error}
              </p>
            )}

            {success && (
              <p className="register-success">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <div className="register-footer">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Sign in
            </button>

          </div>

        </section>

      </div>

    </main>
  );
};

export default Register;