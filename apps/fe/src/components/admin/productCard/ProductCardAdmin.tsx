import { useState, type FormEvent } from "react";
import client from "../../../api/client";
import type { Size } from "../../../types/enums/size";
import styles from "./ProductCardAdmin.module.css";

interface ProductDto {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  imgURL?: string | undefined;
  categoryIds: number[];
  isInFavorite?: boolean;
}

interface PatchProductDto {
  name: string;
  color: string;
  price: number;
  imgURL: string;
  inStock: boolean;
  categoryIds: number[];
  sizes: Size[];
}

const deleteProduct = async (id: number) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const { error } = await client.delete<void>(
    "/products/:id".replace(":id", id.toString()),
  );

  if (error) {
    alert("Failed to delete product: " + error);
    return false;
  }

  return true;
};

const editProduct = async (id: number, body: PatchProductDto) => {
  const { data, error } = await client.patch<ProductDto, PatchProductDto>(
    "/products/:id".replace(":id", id.toString()),
    body,
  );

  if (error) {
    alert("Failed to update product: " + error);
    return null;
  }

  return data;
};

const parseCategoryIds = (value: string): number[] =>
  value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id));

const parseSizes = (value: string): Size[] =>
  value
    .split(",")
    .map((size) => size.trim())
    .filter((size) => size.length > 0) as Size[];

export const ProductCardAdmin = ({ product }: { product: ProductDto }) => {
  const [productData, setProductData] = useState(product);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [formValues, setFormValues] = useState<PatchProductDto>({
    name: product.name,
    color: "",
    price: product.price,
    imgURL: product.imgURL ?? "",
    inStock: product.inStock,
    categoryIds: product.categoryIds,
    sizes: [],
  });

  if (isDeleted) return null;

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    const updatedProduct = await editProduct(productData.id, formValues);
    setIsLoading(false);

    if (!updatedProduct) return;

    setProductData({
      ...updatedProduct,
      name: formValues.name,
      imgURL: formValues.imgURL,
    });
    setIsExpanded(false);
    alert("Product updated successfully.");
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const wasDeleted = await deleteProduct(productData.id);
    setIsLoading(false);

    if (!wasDeleted) return;
    setIsDeleted(true);
  };

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.summaryBtn}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <img
          className={styles.smallImg}
          src={
            productData.imgURL || "https://via.placeholder.com/56?text=No+Img"
          }
          alt={productData.name}
        />
        <div className={styles.summaryText}>
          <p className={styles.name}>{productData.name}</p>
          <p className={styles.id}>ID: {productData.id}</p>
        </div>
      </button>

      {isExpanded && (
        <form className={styles.expandPanel} onSubmit={handleEditSubmit}>
          <label className={styles.field}>
            Name
            <input
              value={formValues.name}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, name: e.target.value }))
              }
              className={styles.input}
              required
            />
          </label>

          <label className={styles.field}>
            Color
            <input
              value={formValues.color}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, color: e.target.value }))
              }
              className={styles.input}
              required
            />
          </label>

          <label className={styles.field}>
            Price
            <input
              type="number"
              step="0.01"
              value={String(formValues.price)}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              className={styles.input}
              required
            />
          </label>

          <label className={styles.field}>
            Image URL
            <input
              value={formValues.imgURL}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, imgURL: e.target.value }))
              }
              className={styles.input}
              required
            />
          </label>

          <label className={styles.field}>
            Category IDs (comma separated)
            <input
              value={formValues.categoryIds.join(",")}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  categoryIds: parseCategoryIds(e.target.value),
                }))
              }
              className={styles.input}
              required
            />
          </label>

          <label className={styles.field}>
            Sizes (comma separated)
            <input
              value={formValues.sizes.join(",")}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  sizes: parseSizes(e.target.value),
                }))
              }
              className={styles.input}
              required
            />
          </label>

          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={formValues.inStock}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  inStock: e.target.checked,
                }))
              }
            />
            In stock
          </label>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isLoading}
            >
              Save
            </button>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsExpanded(false)}
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </form>
      )}
    </article>
  );
};
