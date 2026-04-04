import { useState, type FormEvent } from "react";
import client from "../../../api/client";
import type { Size } from "../../../types/enums/size";
import styles from "./AddProductAdmin.module.css";

interface CreateProductDto {
  name: string;
  color: string;
  price: number;
  imgURL?: string;
  inStock: boolean;
  categoryIds: number[];
  sizes: Size[];
}

interface AddProductAdminProps {
  onCreated?: () => void;
}

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

const createProduct = async (body: CreateProductDto) => {
  const { error } = await client.post("/products", body);

  if (error) {
    alert("Failed to create product: " + error);
    return false;
  }

  return true;
};

export const AddProductAdmin = ({ onCreated }: AddProductAdminProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryIdsInput, setCategoryIdsInput] = useState("");
  const [sizesInput, setSizesInput] = useState("");
  const [formValues, setFormValues] = useState<CreateProductDto>({
    name: "",
    color: "",
    price: 0,
    imgURL: "",
    inStock: true,
    categoryIds: [],
    sizes: [],
  });

  const resetForm = () => {
    setFormValues({
      name: "",
      color: "",
      price: 0,
      imgURL: "",
      inStock: true,
      categoryIds: [],
      sizes: [],
    });
    setCategoryIdsInput("");
    setSizesInput("");
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateProductDto = {
      ...formValues,
      name: formValues.name.trim(),
      color: formValues.color.trim(),
      imgURL: formValues.imgURL?.trim(),
      categoryIds: parseCategoryIds(categoryIdsInput),
      sizes: parseSizes(sizesInput),
    };
    setIsLoading(true);
    const created = await createProduct(payload);
    setIsLoading(false);

    if (!created) return;

    alert("Product created successfully.");
    resetForm();
    setIsExpanded(false);
    onCreated?.();
  };

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.summaryBtn}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className={styles.badge}>+</span>
        <div className={styles.summaryText}>
          <p className={styles.name}>Add New Product</p>
          <p className={styles.meta}>Create and save a product</p>
        </div>
      </button>

      {isExpanded && (
        <form className={styles.expandPanel} onSubmit={handleCreateSubmit}>
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
              min="0.01"
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
            />
          </label>

          <label className={styles.field}>
            Category IDs (comma separated)
            <input
              value={categoryIdsInput}
              onChange={(e) => setCategoryIdsInput(e.target.value)}
              className={styles.input}
              placeholder="1,2"
              required
            />
          </label>

          <label className={styles.field}>
            Sizes (comma separated)
            <input
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              className={styles.input}
              placeholder="S,M,L,XL"
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
              Create
            </button>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={resetForm}
              disabled={isLoading}
            >
              Clear
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
