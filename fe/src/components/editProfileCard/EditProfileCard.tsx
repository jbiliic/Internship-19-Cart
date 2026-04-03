import React, { useState } from "react";
import client from "../../api/client";
import styles from "./EditProfileCard.module.css";

interface EditProfileCardProps {
  onClose?: () => void;
  userData?: CurrentUserProfile | null;
}

interface CurrentUserProfile {
  email: string;
  name: string;
  IBAN: string;
  address: string;
  county: string;
  city: string;
  zipCode: number;
}
interface EditProfileDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  county: string;
  address: string;
  city: string;
  zipCode: number | "";
  IBAN: string;
}

export const EditProfileCard = ({
  onClose,
  userData,
}: EditProfileCardProps) => {
  const [formData, setFormData] = useState<EditProfileDTO>({
    name: userData?.name || "",
    email: userData?.email || "",
    password: "",
    confirmPassword: "",
    IBAN: userData?.IBAN || "",
    address: userData?.address || "",
    county: userData?.county || "",
    city: userData?.city || "",
    zipCode: userData?.zipCode || ("" as unknown as number),
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const parsedValue =
      id === "zipCode" ? (value === "" ? "" : Number(value)) : value;

    setFormData((prev) => ({ ...prev, [id]: parsedValue }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      (formData.password || formData.confirmPassword) &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    const { confirmPassword, ...rest } = formData;

    const payload = {
      ...rest,
      zipCode: Number(rest.zipCode),
      ...(rest.password ? {} : { password: undefined }),
    };

    const { data, error } = await client.put("/users/me", payload);

    setLoading(false);

    if (error) {
      setError(error || "Profile update failed.");
      return;
    }
    if (data) {
      alert("Profile updated successfully!");
      onClose?.();
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.cardContainer}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <h1>Edit Profile</h1>
            {onClose && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close edit profile"
              >
                x
              </button>
            )}
          </div>
          <p className={styles.subtitle}>Update your account details</p>
        </header>

        <form className={styles.form} onSubmit={handleSave}>
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
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.actionsRow}>
            {onClose && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
