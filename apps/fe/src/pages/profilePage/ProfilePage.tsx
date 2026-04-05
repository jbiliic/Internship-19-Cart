import { useQuery } from "@tanstack/react-query";
import client from "../../api/client";
import LoadingCircle from "../../components/loadingCircle/LoadingCircle";
import { UserProfileCard } from "../../components/userProfileCard/UserProfileCard";
import { useAuth } from "../../providers/auth/useAuth";
import styles from "./ProfilePage.module.css";
import { EditProfileCard } from "../../components/editProfileCard/EditProfileCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfileDto {
  email: string;
  name: string;
  IBAN: string;
  address: string;
  county: string;
  city: string;
  zipCode: number;
}

const fetchUserProfile = async () => {
  const { data, error } = await client.get<UserProfileDto>("/users/me");

  if (error) {
    throw new Error(error);
  }

  return data;
};

export const ProfilePage = () => {
  const { logout } = useAuth();
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  if (isLoading) return <LoadingCircle />;

  if (error || !data) {
    return (
      <div className={styles.card}>
        <p className={styles.errorText}>Unable to load your profile card.</p>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <div className={styles.cardContainer}>
        <UserProfileCard data={data} />
      </div>

      <div className={styles.actionsContainer}>
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        {isAdmin && (
          <button onClick={() => navigate("/admin")}>Admin Panel</button>
        )}
      </div>

      {isEditing && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsEditing(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <EditProfileCard
              userData={data}
              onClose={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
      <button onClick={logout}>Log Out</button>
    </div>
  );
};
