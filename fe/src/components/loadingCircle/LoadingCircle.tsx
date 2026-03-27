import React from "react";
import styles from "./LoadingCircle.module.css";

const LoadingCircle: React.FC = () => {
  return (
    <div className={styles.container} role="status">
      <div className={styles.spinner} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingCircle;
