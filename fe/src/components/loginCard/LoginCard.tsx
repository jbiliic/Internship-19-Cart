import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import styles from "./LoginCard.module.css";
import type { LoginResponse } from "../../types/auth/loginResponse.dto";
import { routes } from "../../constants/routes";
import { useAuth } from "../../providers/auth/useAuth";

interface LoginCardProps {
  onToggle: () => void;
}

export const LoginCard = ({ onToggle }: LoginCardProps) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: apiError } = await client.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      },
    );

    setLoading(false);

    if (apiError) {
      setError(apiError || "An error occurred during login. Please try again.");
      return;
    }

    if (data) {
      login(data.access_token, data.isAdmin);
      alert("Login successful!");
      navigate(routes.HOME);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginContainer}>
        <header className={styles.header}>
          <h1>Login</h1>
        </header>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.registerLink} onClick={onToggle}>
            Don't have an account?{" "}
            <span className={styles.blueText}>Register!</span>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
