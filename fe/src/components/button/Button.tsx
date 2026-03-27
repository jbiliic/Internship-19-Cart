import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  fullWidth,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.full : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
