import React, { useState } from "react";
import client from "../../api/client";
import styles from "./RegisterCard.module.css";
import type { RegisterDto } from "../../types/auth/register.dto";

interface RegisterCardProps {
  onToggle: () => void;
}
interface RegisterFormState extends RegisterDto {
  confirmPassword: string;
}

export const RegisterCard = ({ onToggle }: RegisterCardProps) => {
  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    IBAN: "",
    address: "",
    county: "",
    city: "",
    zipCode: "" as unknown as number,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    const { confirmPassword, ...rest } = formData;

    const payload: RegisterDto = {
      ...rest,
      zipCode: Number(formData.zipCode),
    };

    const { data, error } = await client.post("/auth/register", payload);

    setLoading(false);

    if (error) {
      setError(error || "Registration failed.");
      return;
    }
    if (data) {
      alert("Registration successful! Please login.");
      onToggle();
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.registerContainer}>
        <header className={styles.header}>
          <h1>Create Account</h1>
        </header>

        <form className={styles.registerForm} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="IBAN">IBAN</label>
            <input
              type="text"
              id="IBAN"
              placeholder="RO1234567890..."
              value={formData.IBAN}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              placeholder="123 Main St"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                placeholder="Some City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="zipCode">Zip Code</label>
              <input
                type="number"
                id="zipCode"
                placeholder="12345"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="county">County</label>
            <input
              type="text"
              id="county"
              placeholder="Some County"
              value={formData.county}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.loginLink} onClick={onToggle}>
            Already have an account?{" "}
            <span className={styles.blueText}>login!</span>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};
