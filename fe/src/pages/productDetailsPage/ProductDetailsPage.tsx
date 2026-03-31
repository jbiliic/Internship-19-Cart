import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import client from "../../api/client";
import LoadingCircle from "../../components/loadingCircle/LoadingCircle";
import type { Size } from "../../types/enums/size";
import styles from "./ProductDetailsPage.module.css";
import { useCart } from "../../providers/cart/useCart";

interface ProductDetailsPageProps {
  productId?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  color: string;
  inStock: boolean;
  sizes: Size[];
  imgURL: string;
  categoryIds: number[];
  isInFavorite?: boolean;
  IsInFavorite?: boolean;
}

const fetchProduct = async (productId?: number) => {
  if (!productId) {
    throw new Error("Missing product id");
  }

  const { data, error } = await client.get<Product>(`/products/${productId}`);

  if (error || !data) {
    throw new Error(error ?? "Unable to load product details");
  }

  return data;
};

const formatSizeLabel = (size: Size) => {
  if (size === "ONE_SIZE") return "ONE SIZE";
  return size;
};

const formatPrice = (price: number) =>
  `${price.toFixed(2).replace(".", ",")} $`;

export const ProductDetailsPage = ({ productId }: ProductDetailsPageProps) => {
  const { addItem } = useCart();
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const resolvedProductId = productId ?? (id ? Number(id) : undefined);
  const hasValidProductId =
    typeof resolvedProductId === "number" &&
    Number.isFinite(resolvedProductId) &&
    resolvedProductId > 0;

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-details", resolvedProductId],
    queryFn: () => fetchProduct(resolvedProductId),
    enabled: hasValidProductId,
  });

  useEffect(() => {
    if (!product) return;

    setSelectedSize(product.sizes[0] ?? null);
    setIsFavorite(Boolean(product.isInFavorite ?? product.IsInFavorite));
    setQuantity(1);
  }, [product]);

  const handleToggleFavorite = async (productId: number) => {
    const { error } = isFavorite
      ? await client.delete(`/favorites/${productId}`)
      : await client.post(`/favorites/${productId}`);

    if (error) {
      alert(error);
      return;
    }

    setIsFavorite((prev) => !prev);
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    addItem({
      productId: product.id,
      quantity,
      selectedSize,
    });
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityInputChange = (value: string) => {
    if (!value) {
      setQuantity(1);
      return;
    }

    const nextValue = Number(value);
    if (Number.isNaN(nextValue)) return;

    setQuantity(Math.max(1, Math.min(99, Math.floor(nextValue))));
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <LoadingCircle />
      </div>
    );
  }

  if (!hasValidProductId) {
    return (
      <div className={styles.page}>
        <p className={styles.errorState}>Invalid product id.</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <p className={styles.errorState}>Unable to load product details.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <div className={styles.imageCard}>
          <img
            src={product.imgURL}
            alt={product.name}
            className={styles.productImage}
          />
        </div>

        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.price}>{formatPrice(product.price)}</p>

        <p className={styles.sizeLabel}>Sizes:</p>
        <div className={styles.sizesGrid}>
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.sizeBtn} ${
                selectedSize === size ? styles.sizeBtnActive : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {formatSizeLabel(size)}
            </button>
          ))}
        </div>

        <div className={styles.quantitySection}>
          <p className={styles.quantityLabel}>Quantity:</p>
          <div className={styles.quantityControl}>
            <button
              type="button"
              className={styles.quantityBtn}
              onClick={decreaseQuantity}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(event) =>
                handleQuantityInputChange(event.target.value)
              }
              className={styles.quantityInput}
              aria-label="Selected quantity"
            />
            <button
              type="button"
              className={styles.quantityBtn}
              onClick={increaseQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.addToCartBtn}
            disabled={!product.inStock || !selectedSize}
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
          <button
            type="button"
            className={styles.favoriteBtn}
            onClick={() => handleToggleFavorite(product.id)}
            aria-label="Toggle favorite"
          >
            <Heart
              size={20}
              strokeWidth={1.8}
              color="#8b1e0f"
              fill={isFavorite ? "#8b1e0f" : "none"}
            />
          </button>
        </div>
      </section>

      <button
        type="button"
        className={styles.closeBtn}
        onClick={() => window.history.back()}
        aria-label="Close product details"
      >
        <X size={18} />
      </button>
    </div>
  );
};
