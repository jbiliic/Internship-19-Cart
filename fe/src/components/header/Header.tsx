import { Bell } from "lucide-react";
import styles from "./Header.module.css";
import cartIcon from "../../assets/splashScreenLogos/logo1.jpg";
import cartText from "../../assets/splashScreenLogos/brand.jpg";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoGroup}>
          <img src={cartIcon} alt="Cart Icon" className={styles.logoIcon} />
          <img src={cartText} alt="CART" className={styles.logoTextImg} />
        </div>
        <div className={styles.notification}>
          <Bell size={28} strokeWidth={2} />
          <div className={styles.badge}></div>
        </div>
      </div>
    </header>
  );
};
