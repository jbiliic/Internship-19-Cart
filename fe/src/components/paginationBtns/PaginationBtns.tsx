import style from "./PaginationBtns.module.css";

interface PaginationBtnsProps {
  onPrevious: () => void;
  onNext: () => void;
  currentPage: number;
  hasMore: boolean;
}

export const PaginationBtns = (props: PaginationBtnsProps) => {
  return (
    <div className={style.paginationBtns}>
      {props.currentPage > 1 && (
        <button className={style.paginationBtn} onClick={props.onPrevious}>
          Previous
        </button>
      )}
      {props.hasMore && (
        <button className={style.paginationBtn} onClick={props.onNext}>
          Next
        </button>
      )}
    </div>
  );
};
