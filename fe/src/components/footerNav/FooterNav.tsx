import { NavLink } from "react-router-dom";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import styles from "./FooterNav.module.css";
import { routes } from "../../constants/routes";

export const FooterNav = () => {
  return (
    <nav className={styles.nav}>
      <NavLink
        to={routes.HOME}
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
        }
      >
        <Home size={24} strokeWidth={1.5} />
      </NavLink>

      <NavLink
        to={routes.PRODUCTS}
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
        }
      >
        <Search size={24} strokeWidth={1.5} />
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
        }
      >
        <Heart size={24} strokeWidth={1.5} />
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
        }
      >
        <ShoppingBag size={24} strokeWidth={1.5} />
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
        }
      >
        <User size={24} strokeWidth={1.5} />
      </NavLink>
    </nav>
  );
};
