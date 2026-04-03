import { useEffect, useState } from "react";
import client from "../../api/client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Filter } from "lucide-react";
import styles from "./SearchPage.module.css";
import { CategoryWheel } from "../../components/categoriesWheel/CategoriesWheel";
import { ProductCard } from "../../components/searchPageCard/SearchPageCard";
import { FilterCard } from "../../components/filterCard/FilterCard";
import { PaginationBtns } from "../../components/paginationBtns/PaginationBtns";
import LoadingCircle from "../../components/loadingCircle/LoadingCircle";
import { routes } from "../../constants/routes";

interface FilteringQuery {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "name";
  sortOrder?: "asc" | "desc";
  inStock?: boolean;
  page?: number;
  limit?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  imgURL?: string;
  categoryIds: number[];
  isInFavorite?: boolean;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const fetchProducts = async (query: FilteringQuery) => {
  const { data } = await client.get<ProductsResponse>("/products", {
    params: query,
  });
  return data;
};

const parseUrlToQuery = (params: URLSearchParams): FilteringQuery => {
  return {
    search: params.get("search") || undefined,
    categoryId: params.get("categoryId")
      ? Number(params.get("categoryId"))
      : undefined,
    minPrice: params.get("minPrice")
      ? Number(params.get("minPrice"))
      : undefined,
    maxPrice: params.get("maxPrice")
      ? Number(params.get("maxPrice"))
      : undefined,
    sortBy: (params.get("sortBy") as "price" | "name") || undefined,
    sortOrder: (params.get("sortOrder") as "asc" | "desc") || undefined,
    inStock: params.get("inStock") === "true" || undefined,
    page: Number(params.get("page")) || 1,
    limit: Number(params.get("limit")) || 10,
  };
};

export const SearchPage = () => {
  const location = useLocation();
  const search = location.state;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const activeQuery = parseUrlToQuery(searchParams);
  const [inputValue, setInputValue] = useState(
    activeQuery.search || search || "",
  );
  const [debouncedSearch] = useDebounce(inputValue, 300);

  useEffect(() => {
    updateFilters({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  const updateFilters = (updates: Partial<FilteringQuery>) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (
            value === undefined ||
            value === null ||
            (Array.isArray(value) && value.length === 0)
          ) {
            newParams.delete(key);
          } else if (Array.isArray(value)) {
            newParams.delete(key);
            value.forEach((v) => newParams.append(key, String(v)));
          } else {
            newParams.set(key, String(value));
          }
        });
        return newParams;
      },
      { replace: true },
    );
  };

  const productsQueryKey = ["products", searchParams.toString()];

  const { data, isLoading, error } = useQuery({
    queryKey: productsQueryKey,
    queryFn: () => fetchProducts(activeQuery),
    placeholderData: keepPreviousData,
  });

  const handleToggleFavorite = async (id: number) => {
    const product = data?.data.find((p) => p.id === id);
    if (!product) {
      alert("Product not found");
      return;
    }

    const currentlyFavorite = Boolean(product.isInFavorite);
    const response = currentlyFavorite
      ? await client.delete<null>(`/favorites/${id}`)
      : await client.post<null>(`/favorites/${id}`);

    if (response.error) {
      alert(response.error);
      return;
    }

    queryClient.setQueryData<ProductsResponse | null>(
      productsQueryKey,
      (previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          data: previous.data.map((item) =>
            item.id === id
              ? { ...item, isInFavorite: !currentlyFavorite }
              : item,
          ),
        };
      },
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.searchHeader}>
        <div className={styles.searchInputWrapper}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <CategoryWheel
          activeCategoryId={activeQuery.categoryId}
          onSelectCategory={(id) => updateFilters({ categoryId: id, page: 1 })}
        />
      </header>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          {activeQuery.search
            ? `Results for "${activeQuery.search}"`
            : "All Products"}
        </h1>
      </div>

      <main>
        {isLoading && !data ? (
          <LoadingCircle />
        ) : error ? (
          <div className={styles.emptyState}>
            An error occurred while fetching products.
          </div>
        ) : data?.data.length === 0 ? (
          <div className={styles.emptyState}>No products found.</div>
        ) : (
          <>
            <div className={styles.productGrid}>
              {data?.data.map((product: Product) => (
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

            <div className={styles.paginationWrapper}>
              <PaginationBtns
                currentPage={data?.page || 1}
                hasMore={data?.hasNextPage || false}
                onPrevious={() =>
                  updateFilters({ page: activeQuery.page! - 1 })
                }
                onNext={() => updateFilters({ page: activeQuery.page! + 1 })}
              />
            </div>
          </>
        )}
      </main>

      <button
        className={styles.filterButtonFixed}
        onClick={() => setIsFilterOpen(true)}
      >
        <Filter size={18} />
        Filter
      </button>
      <FilterCard
        isOpen={isFilterOpen}
        currentFilters={activeQuery}
        onClose={() => setIsFilterOpen(false)}
        onUpdate={updateFilters}
      />
    </div>
  );
};
