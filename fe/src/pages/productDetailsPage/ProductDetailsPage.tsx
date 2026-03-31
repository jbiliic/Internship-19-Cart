import { Heart, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import client from "../../api/client";
import LoadingCircle from "../../components/loadingCircle/LoadingCircle";
import type { Size } from "../../types/enums/size";
import styles from "./ProductDetailsPage.module.css";

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
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
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
  }, [product]);

  const categories = useMemo(
    () => ["Sve", "Streetwear", "Formal", "Casual"],
    [],
  );
  const handleToggleFavorite = async (productId: number) => {
    const { data, error } = isFavorite
      ? await client.delete<{ success: boolean }>(`/favorites/${productId}`)
      : await client.post<{ success: boolean }>(`/favorites/${productId}`);

    if (error) {
      alert(error);
      return;
    }

    setIsFavorite((prev) => !prev);
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

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.addToCartBtn}
            disabled={!product.inStock || !selectedSize}
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
