import styles from "./MainPageCard.module.css";

interface MainPageCardProps {
  title: string;
  price?: number;
  imageUrl: string;
  backgroundColor: string;
  onClick?: () => void;
}

export const MainPageCard = ({
  title,
  price,
  imageUrl,
  backgroundColor,
  onClick,
}: MainPageCardProps) => {
  return (
    <div
      className={styles.card}
      style={{ borderColor: backgroundColor }}
      onClick={onClick}
    >
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} />
      </div>

      <div
        className={styles.infoSection}
        style={{ backgroundColor: backgroundColor }}
      >
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>{title}</h3>
          {price && <span className={styles.price}>{price} $</span>}
        </div>
        <div className={styles.arrow}>&gt;</div>
      </div>
    </div>
  );
};
