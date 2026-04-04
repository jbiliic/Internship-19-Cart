import { useQuery } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import client from "../../api/client";
import { CartProductCard } from "../../components/cartProductCard/CartProductCard";
import { useCart } from "../../providers/cart/useCart";
import type { Size } from "../../types/enums/size";
import styles from "./CartPage.module.css";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

interface ProductDto {
  id: number;
  name: string;
  price: number;
  color: string;
  inStock: boolean;
  sizes: Size[];
  imgURL: string;
  categoryIds: number[];
}

const getIdsFromCartItems = (
  items: { productId: number; quantity: number; selectedSize: Size }[],
): number[] => {
  const uniqueIds = new Set(items.map((item) => item.productId));
  return [...uniqueIds];
};

const getDeliveryDate = (): string => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3);
  return deliveryDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} EUR`;

export const CartPage = () => {
  const navigate = useNavigate();
  const { items } = useCart();

  const fetchCartProducts = async (
    items: { productId: number; quantity: number; selectedSize: Size }[],
  ) => {
    const ids = getIdsFromCartItems(items);

    if (ids.length === 0) {
      return [];
    }

    const { data, error } = await client.get<ProductDto[]>("/products/cart", {
      params: { ids: ids.join(",") },
    });

    if (error) {
      throw new Error(error);
    }

    return data ?? [];
  };

  const cartQueryKey = items
    .map((item) => `${item.productId}-${item.selectedSize}-${item.quantity}`)
    .join("|");

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cartProducts", cartQueryKey],
    queryFn: () => fetchCartProducts(items),
    enabled: items.length > 0,
  });

  const productsById = new Map(
    products.map((product) => [product.id, product]),
  );

  const cartEntries = items
    .map((item) => ({
      item,
      product: productsById.get(item.productId),
    }))
    .filter(
      (entry): entry is { item: (typeof items)[number]; product: ProductDto } =>
        Boolean(entry.product),
    );

  const totalToPay = cartEntries.reduce(
    (sum, entry) => sum + entry.product.price * entry.item.quantity,
    0,
  );

  return (
    <div className={styles.cartPage}>
      <header className={styles.titleRow}>
        <h1 className={styles.title}>Cart</h1>
      </header>

      <div className={styles.noticeRow}>
        <CircleAlert size={14} />
        <span>PRODUCTS ARE NOT RESERVED</span>
      </div>

      <section className={styles.deliveryRow}>
        <div>
          <p className={styles.deliveryTitle}>Delivery</p>
          <p className={styles.deliverySource}>By CART</p>
        </div>
        <span className={styles.deliveryEta}>~{getDeliveryDate()}</span>
      </section>

      <section className={styles.itemsSection}>
        {isLoading ? (
          <p className={styles.infoState}>Loading products...</p>
        ) : error ? (
          <p className={styles.errorState}>Failed to load cart.</p>
        ) : cartEntries.length === 0 ? (
          <p className={styles.infoState}>Cart is empty.</p>
        ) : (
          <div className={styles.cartItems}>
            {cartEntries.map(({ item, product }) => (
              <CartProductCard
                key={`${item.productId}-${item.selectedSize}-${item.quantity}`}
                product={product}
                cartItem={item}
              />
            ))}
          </div>
        )}
      </section>

      <footer className={styles.checkoutBar}>
        <div className={styles.totalRow}>
          <p className={styles.totalLabel}>Total to Pay</p>
          <p className={styles.totalMeta}>including VAT</p>
          <p className={styles.totalPrice}>{formatPrice(totalToPay)}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate(routes.CHECKOUT)}
          className={styles.orderButton}
          disabled={items.length === 0 || isLoading || cartEntries.length === 0}
        >
          To Checkout
        </button>
      </footer>

      {items.length > 0 && cartEntries.length !== items.length ? (
        <p className={styles.missingItemsWarning}>
          Some products are currently not available for display in the cart.
        </p>
      ) : (
        <span className={styles.visuallyHidden}>Cart status ok.</span>
      )}
    </div>
  );
};
