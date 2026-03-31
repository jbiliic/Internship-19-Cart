import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import type { Size } from "../../types/enums/size";
import LoadingCircle from "../../components/loadingCircle/LoadingCircle";
import { ProductCard } from "../../components/searchPageCard/SearchPageCard";
import styles from "./FavoritesPage.module.css";
import { routes } from "../../constants/routes";

interface FavoriteProduct {
  id: number;
  name: string;
  size: Size[];
  color: string;
  price: number;
  imageURL: string;
}

interface ProductCardModel {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  imgURL?: string;
  categoryIds: number[];
  isInFavorite?: boolean;
}

const fetchFavorites = async () => {
  const { data, error } = await client.get<FavoriteProduct[]>("/favorites");
  if (error) {
    throw new Error(error);
  }
  return data;
};

export const FavoritesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryFn: fetchFavorites,
    queryKey: ["favorites"],
  });

  const handleToggleFavorite = async (id: number) => {
    const response = await client.delete<null>(`/favorites/${id}`);
    if (response.error) {
      alert(response.error);
      return;
    }

    queryClient.setQueryData<FavoriteProduct[] | null>(
      ["favorites"],
      (previous) => {
        if (!previous) return previous;
        return previous.filter((item) => item.id !== id);
      },
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingCircle />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.emptyState}>Unable to load favorites.</p>
      </div>
    );
  }

  const products: ProductCardModel[] =
    data?.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imgURL: product.imageURL,
      inStock: true,
      categoryIds: [],
      isInFavorite: true,
    })) ?? [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Favorites</h1>

      {products.length === 0 ? (
        <p className={styles.emptyState}>No favorites yet.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleFavorite={handleToggleFavorite}
              onClick={(id) =>
                navigate(routes.PRODUCT_DETAILS.replace(":id", String(id)))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
