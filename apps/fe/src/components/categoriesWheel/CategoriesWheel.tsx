import { useQuery } from "@tanstack/react-query";
import client from "../../api/client";
import styles from "./CategoriesWheel.module.css";
import LoadingCircle from "../loadingCircle/LoadingCircle";
import { useEffect, useRef } from "react";

interface Category {
  id: number;
  name: string;
}

const fetchCategories = async () => {
  const { data } = await client.get<Category[]>("/categories");
  return data;
};

interface CategoryWheelProps {
  activeCategoryId?: number;
  onSelectCategory: (id?: number) => void;
}

export const CategoryWheel = ({
  activeCategoryId,
  onSelectCategory,
}: CategoryWheelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({ left: el.scrollLeft + e.deltaY });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  if (isLoading) return <div className={styles.container}>...</div>;

  return (
    <div className={styles.container} ref={scrollRef}>
      <button
        className={`${styles.pill} ${!activeCategoryId ? styles.activePill : ""}`}
        onClick={() => onSelectCategory(undefined)}
      >
        All
      </button>

      {isLoading ? (
        <LoadingCircle />
      ) : (
        categories?.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.pill} ${
              activeCategoryId === cat.id ? styles.activePill : ""
            }`}
            onClick={() => {
              onSelectCategory(
                activeCategoryId === cat.id ? undefined : cat.id,
              );
            }}
          >
            {cat.name}
          </button>
        ))
      )}
    </div>
  );
};
