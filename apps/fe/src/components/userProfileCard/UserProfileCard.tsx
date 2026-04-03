import styles from "./UserProfileCard.module.css";

interface UserProfileProps {
  email: string;
  name: string;
  IBAN: string;
  address: string;
  county: string;
  city: string;
  zipCode: number;
}

interface UserProfileCardProps {
  data: UserProfileProps | null;
}

export const UserProfileCard = ({ data }: UserProfileCardProps) => {
  if (!data) {
    return <div className={styles.card}>User profile data not available.</div>;
  }

  const regionDetails = [data.county, `${data.city} ${data.zipCode}`.trim()]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.card}>
      <section className={styles.profileSection}>
        <div className={styles.avatarWrap} aria-hidden="true">
          <span className={styles.avatarHead} />
          <span className={styles.avatarBody} />
        </div>

        <div className={styles.infoStack}>
          <p className={styles.infoRow}>
            <span className={styles.label}>NAME:</span>
            <span className={styles.value}>{data.name}</span>
          </p>

          <p className={styles.infoRow}>
            <span className={styles.label}>ADDRESS:</span>
            <span className={styles.value}>{data.address}</span>
          </p>

          <p className={styles.infoRow}>
            <span className={styles.label}>REGION:</span>
            <span className={styles.value}>{regionDetails}</span>
          </p>
        </div>
      </section>

      <section className={styles.paymentSection}>
        <div className={styles.visaWrap} aria-hidden="true">
          <span className={styles.visaLine} />
          <span className={styles.visaBrand}>VISA</span>
          <span className={styles.visaLine} />
        </div>

        <div className={styles.infoStack}>
          <p className={styles.infoRow}>
            <span className={styles.label}>IBAN:</span>
            <span className={styles.value}>{data.IBAN}</span>
          </p>
        </div>
      </section>
    </div>
  );
};
