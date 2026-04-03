import type { Size } from "../../types/enums/size";
import { CircleAlert, Trash2 } from "lucide-react";
import styles from "./CartProductCard.module.css";
import { useCart } from "../../providers/cart/useCart";

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
interface CartItemDto {
  productId: number;
  quantity: number;
  selectedSize: Size;
}
interface CartProductCardProps {
  product: ProductDto;
  cartItem: CartItemDto;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const CartProductCard = ({
  product,
  cartItem,
}: CartProductCardProps) => {
  const unitPrice = formatPrice(product.price);
  const totalPrice = formatPrice(product.price * cartItem.quantity);
  const { removeItem } = useCart();

  return (
    <article className={styles.card}>
      <div className={styles.imagePane}>
        <img src={product.imgURL} alt={product.name} className={styles.image} />
        <span className={styles.sellerTag}>By CART</span>
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.meta}>
              {product.color} / {cartItem.selectedSize}
            </p>
          </div>
          <button
            onClick={() => removeItem(cartItem)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            aria-label="Delete item"
          >
            <Trash2 size={20} />
          </button>
        </header>

        <div className={styles.priceBlock}>
          <p className={styles.price}>Total: {totalPrice} EUR</p>
          <p className={styles.subPrice}>{unitPrice} EUR</p>
          <p className={styles.subPrice}>Amount: {cartItem.quantity}</p>
        </div>

        <div className={styles.footerMeta}>
          <CircleAlert size={14} />
          <span>The lowest price in the last 30 days: {unitPrice} EUR</span>
        </div>
      </div>
    </article>
  );
};
