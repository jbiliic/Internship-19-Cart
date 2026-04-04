import { useState } from "react";
import { orderStatus, type OrderStatus } from "../../types/enums/status";
import client from "../../api/client";
import { OrderCard } from "../../components/admin/orderCard/OrderCard";
import { useQuery } from "@tanstack/react-query";
import type { Size } from "../../types/enums/size";
import { ProductCardAdmin } from "../../components/admin/productCard/ProductCardAdmin";

interface ProductDto {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  imgURL?: string;
  categoryIds: number[];
}
interface ProductOrderDto {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imgURL: string;
  color: string;
  inStock: boolean;
  size: Size;
}

interface OrderDto {
  id: number;
  totalPrice: number;
  products: ProductOrderDto[];
  status?: OrderStatus;
  IBAN: string;
  address: string;
  county: string;
  city: string;
  zipCode: number;
}

interface CategoryDto {
  id: number;
  name: string;
}

interface PaginatedProductsDto {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: ProductDto[];
}

const ORDER_STATUS_OPTIONS = Object.values(orderStatus);

const fetchOrders = async (status?: any) => {
  const { data, error } = await client.get<OrderDto[]>("/orders", {
    params: {
      status: ORDER_STATUS_OPTIONS.includes(status) ? status : undefined,
    },
  });
  if (error) {
    throw new Error(error);
  }
  return data;
};

const fetchCategories = async () => {
  const { data, error } = await client.get<CategoryDto[]>("/categories");
  if (error) {
    throw new Error(error);
  }
  return data;
};

const createCategory = async (name: string) => {
  if (
    !confirm(
      `Are you sure you want to create a new category with the name "${name}"?`,
    )
  ) {
    alert("Category creation cancelled.");
    return;
  }
  const { data, error } = await client.post("/categories", { name: name });
  if (error) {
    alert(error);
    throw new Error(error);
  }
  alert("Category created successfully.");
  return data;
};

const deleteCategories = async (id: number) => {
  if (
    !confirm(
      `Are you sure you want to delete the category with id ${id}? This action cannot be undone.`,
    )
  ) {
    alert("Category deletion cancelled.");
    return;
  }
  const { error } = await client.delete(`/categories/${id}`);
  if (error) {
    alert(error);
    throw new Error(error);
  }
  alert("Category deleted successfully.");
};

const fetchProducts = async () => {
  const { data, error } = await client.get<PaginatedProductsDto>("/products", {
    params: { page: 1, limit: 100 },
  });
  if (error) {
    throw new Error(error);
  }
  return data?.data ?? [];
};

export const AdminPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">(
    "ALL",
  );
  const [selectedCategory, setSelectedCategory] = useState<number | "ALL">(
    "ALL",
  );
  const [categoryInput, setCategoryInput] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", selectedStatus],
    queryFn: () => fetchOrders(selectedStatus),
  });
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <>
      <div>
        <h2>Orders</h2>

        <div>
          <label htmlFor="status">Filter by Status:</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as OrderStatus | "ALL")
            }
          >
            <option value="ALL">All statuses</option>
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {isLoading ? <p>Loading orders...</p> : null}
          {error ? <p>Failed to load orders.</p> : null}
          {data &&
            !isLoading &&
            !error &&
            data.map((order: OrderDto) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      </div>

      <div>
        <h2>Categories</h2>
        <div>
          {isCategoriesLoading ? <p>Loading categories...</p> : null}
          {categoriesError ? <p>Failed to load categories.</p> : null}
          {categoriesData && categoriesData.length > 0 ? (
            <ul>
              {categoriesData.map((category) => (
                <li
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <div>
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
            <button
              onClick={() => {
                createCategory(categoryInput);
                setCategoryInput("");
              }}
            >
              Create Category
            </button>
          </div>
          <button
            onClick={() => deleteCategories(selectedCategory as number)}
            disabled={selectedCategory === "ALL"}
          >
            Delete Selected
          </button>
        </div>
      </div>
      <div>
        <h2>Products</h2>
        <div>
          {productsData && productsData.length > 0
            ? productsData.map((product) => (
                <ProductCardAdmin key={product.id} product={product} />
              ))
            : null}
          {isProductsLoading ? <p>Loading products...</p> : null}
          {productsError ? <p>Failed to load products.</p> : null}
          {!isProductsLoading &&
          !productsError &&
          productsData?.length === 0 ? (
            <p>No products found.</p>
          ) : null}
        </div>
      </div>
    </>
  );
};
