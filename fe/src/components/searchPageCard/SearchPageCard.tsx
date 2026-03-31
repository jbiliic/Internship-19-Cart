import React from "react";
import { Heart } from "lucide-react";
import styles from "./SearchPageCard.module.css";

interface ProductDto {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  imgURL?: string | undefined;
  categoryIds: number[];
  isInFavorite?: boolean;
}

interface ProductCardProps {
  product: ProductDto;
  onToggleFavorite: (id: number) => void;
  onClick?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleFavorite,
  onClick,
}) => {
  const { id, name, price, imgURL, isInFavorite, inStock } = product;

  return (
    <div className={styles.card} onClick={() => onClick?.(id)}>
      <div className={styles.imageWrapper}>
        <img src={imgURL} alt={name} className={styles.productImage} />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          className={styles.favButton}
        >
          <Heart
            size={24}
            strokeWidth={1.5}
            color="black"
            fill={isInFavorite ? "black" : "none"}
          />
        </button>

        {!inStock && (
          <div className={styles.outOfStockOverlay}>
            <span className={styles.soldOutBadge}>Sold Out</span>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{name}</h3>
        <span className={styles.price}>
          {price.toFixed(2).replace(".", ",")} $
        </span>
      </div>
    </div>
  );
};
