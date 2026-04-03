import { useState, type ChangeEvent } from "react";
import client from "../../api/client";
import { useQuery } from "@tanstack/react-query";
import { MainPageCard } from "../../components/mainPageCard/MainPageCard";
import styles from "./MainPage.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import LoadingCircle from "../../components/loadingCircle/LoadingCircle";
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  imgURL: string;
  categoryIds: number[];
}

const fetchRandomProducts = async (): Promise<Product[] | null> => {
  const { data, error } = await client.get<Product[]>("products/random/8");

  if (error) {
    throw new Error(
      error || "Unknown error occurred while fetching random products",
    );
  }

  return data;
};

export const MainPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", "random"],
    queryFn: fetchRandomProducts,
    staleTime: 1000 * 60 * 5,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim() !== "") {
      navigate(routes.PRODUCTS, { state: searchValue });
    }
  };
  const colors = ["#BC8E5E", "#7D7D7D", "#5A463E", "#BC8E5E"];

  if (isError) return <Navigate to={routes.ERROR} state={error} />;

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search for..."
          value={searchValue}
          onChange={handleChange}
          onKeyDown={onSearch}
        />
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          <LoadingCircle />
        ) : (
          products?.map((product, index) => (
            <MainPageCard
              key={product.id}
              title={product.name}
              price={product.price}
              imageUrl={product.imgURL}
              backgroundColor={colors[index % colors.length]}
              onClick={() => {
                navigate(routes.PRODUCT_DETAILS, { state: product.id });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
