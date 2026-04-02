import { UserProfileCard } from "../../components/userProfileCard/UserProfileCard";
import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.cardContainer}>
        <UserProfileCard />
      </div>
    </div>
  );
};
