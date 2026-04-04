import { useQuery } from "@tanstack/react-query";
import { MapPin, Truck } from "lucide-react";
import client from "../../api/client";
import LoadingCircle from "../../components/loadingCircle/LoadingCircle";
import styles from "./CheckoutPage.module.css";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useCart } from "../../providers/cart/useCart";

interface UserDto {
  email: string;
  name: string;
  IBAN: string;
  address: string;
  county: string;
  city: string;
  zipCode: number;
}

const fetchUserData = async () => {
  const { data, error } = await client.get<UserDto>("users/me");

  if (error) {
    throw new Error(error);
  }

  return data;
};

export const CheckoutPage = () => {
  const { placeOrder } = useCart();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout-user"],
    queryFn: fetchUserData,
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <LoadingCircle />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <p className={styles.errorText}>Failed to load checkout data.</p>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>Delivery address</h2>
            <Truck size={22} className={styles.icon} />
          </div>

          <div className={styles.addressRowHeader}>
            <h3 className={styles.addressLabel}>Address</h3>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => navigate(routes.PROFILE)}
            >
              Change
            </button>
          </div>

          <div className={styles.addressLines}>
            <p>{data.name}</p>
            <p>{data.address}</p>
            <p>{data.county}</p>
            <p>
              {data.zipCode} {data.city}
            </p>
          </div>
        </div>

        <div className={styles.pickupRow}>
          <MapPin size={22} className={styles.icon} />
          <span> PICK UP AT A PACKAGING MACHINE</span>
        </div>

        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>PAYMENT ADDRESS</h2>
            <Truck size={22} className={styles.icon} />
          </div>

          <div className={styles.addressRowHeader}>
            <h3 className={styles.addressLabel}>Billing address</h3>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => navigate(routes.PROFILE)}
            >
              Change
            </button>
          </div>

          <div className={styles.addressLines}>
            <p>{data.name}</p>
            <p>{data.address}</p>
            <p>{data.county}</p>
            <p>
              {data.zipCode} {data.city}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.confirmBtn}
          onClick={() => placeOrder()}
        >
          Confirm Order
        </button>
      </section>
    </main>
  );
};
