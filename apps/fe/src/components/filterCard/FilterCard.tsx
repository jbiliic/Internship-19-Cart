import React, { useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import styles from "./FilterCard.module.css";

export interface FilteringQuery {
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

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilteringQuery;
  onUpdate: (filters: Partial<FilteringQuery>) => void;
}

export const FilterCard: React.FC<FilterProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onUpdate,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>FILTER</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <span>Sort by</span>
              <ChevronDown size={18} />
            </div>
            <select
              className={styles.selectInput}
              value={currentFilters.sortBy || ""}
              onChange={(e) =>
                onUpdate({
                  sortBy: (e.target.value as any) || undefined,
                  page: 1,
                })
              }
            >
              <option value="">Default</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <span>Price ($)</span>
              <ChevronDown size={18} />
            </div>
            <div className={styles.priceRange}>
              <input
                type="number"
                placeholder="Min"
                className={styles.input}
                value={currentFilters.minPrice ?? ""}
                onChange={(e) =>
                  onUpdate({
                    minPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                    page: 1,
                  })
                }
              />
              <input
                type="number"
                placeholder="Max"
                className={styles.input}
                value={currentFilters.maxPrice ?? ""}
                onChange={(e) =>
                  onUpdate({
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                    page: 1,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.checkboxGroup}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={!!currentFilters.inStock}
                onChange={(e) =>
                  onUpdate({ inStock: e.target.checked || undefined, page: 1 })
                }
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            <span>Limit</span>
            <ChevronDown size={18} />
          </div>
          <div className={styles.priceRange}>
            <input
              type="number"
              placeholder="Per page"
              className={styles.input}
              value={currentFilters.limit ?? ""}
              onChange={(e) =>
                onUpdate({
                  limit: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.clearBtn}
            onClick={() =>
              onUpdate({
                sortBy: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                inStock: undefined,
                page: 1,
              })
            }
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
