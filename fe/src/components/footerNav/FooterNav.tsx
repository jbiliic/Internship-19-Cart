import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import styles from "./FooterNav.module.css";

export const FooterNav = () => {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
        }
      >
        <Home size={24} strokeWidth={1.5} />
      </NavLink>

      <NavLink
        to="/search"
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
