import { useEffect, useState } from "react";
import client from "../../api/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

interface SearchPageProps {
  search: string;
}

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

const fetchProducts = async (query: FilteringQuery) => {
  const { data, error } = await client.get("/products", { params: query });

  if (error) {
    throw new Error(error || "Unknown error occurred while fetching products");
  }
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
    limit: Number(params.get("limit")) || 20,
  };
};

export const SearchPage = ({ search }: SearchPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
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
          if (value === undefined || value === "" || value === null) {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });
        return newParams;
      },
      { replace: true },
    );
  };
  const { data, isLoading } = useQuery({
    queryKey: ["products", searchParams.toString()],
    queryFn: () => fetchProducts(activeQuery),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      <aside className="col-span-1 border-r p-4">
        {/* TEXT SEARCH */}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search..."
        />

        {/* CATEGORY SELECT */}
        <select
          value={activeQuery.categoryId || ""}
          onChange={(e) =>
            updateFilters({ categoryId: Number(e.target.value) })
          }
        >
          <option value="">All Categories</option>
          <option value="1">Electronics</option>
        </select>

        {/* PRICE FILTERS */}
        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) => updateFilters({ minPrice: Number(e.target.value) })}
        />

        {/* IN STOCK TOGGLE */}
        <label>
          <input
            type="checkbox"
            checked={!!activeQuery.inStock}
            onChange={(e) => updateFilters({ inStock: e.target.checked })}
          />
          In Stock
        </label>
      </aside>

      <main className="col-span-3">
        {isLoading ? <p>Loading...</p> : <ProductList items={data} />}

        {/* PAGINATION */}
        <button onClick={() => updateFilters({ page: activeQuery.page! + 1 })}>
          Next Page
        </button>
      </main>
    </div>
  );
};
