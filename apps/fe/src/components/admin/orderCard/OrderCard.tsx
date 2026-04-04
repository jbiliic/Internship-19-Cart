import { useState } from "react";
import type { Size } from "../../../types/enums/size";
import { orderStatus, type OrderStatus } from "../../../types/enums/status";
import styles from "./OrderCard.module.css";
import client from "../../../api/client";

const ORDER_STATUS_OPTIONS = Object.values(orderStatus);

interface ProductDto {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imgURL: string;
  color: string;
  size: Size;
}

interface OrderDto {
  id: number;
  totalPrice: number;
  products: ProductDto[];
  status?: OrderStatus;
  IBAN: string;
  address: string;
  county: string;
  city: string;
  zipCode: number;
}

export const OrderCard = ({ order }: { order: OrderDto }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status ?? orderStatus.PENDING,
  );

  const handleEditOrderStatus = async () => {
    if (
      !confirm(
        `Are you sure you want to change the order status to ${selectedStatus}?`,
      )
    )
      return;
    const { error } = await client.patch(`/orders/${order.id}/status`, {
      status: selectedStatus,
    });
    if (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    } else {
      alert("Order status updated successfully.");
    }
  };

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.summaryButton}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className={styles.summaryText}>Order #{order.id}</span>
        <span className={styles.statusBadge}>{selectedStatus}</span>
      </button>

      {isExpanded && (
        <div className={styles.detailsSection}>
          <p>
            <strong>Total:</strong> ${order.totalPrice}
          </p>
          <p>
            <strong>Address:</strong> {order.address}, {order.city},{" "}
            {order.county}, {order.zipCode}
          </p>
          <p>
            <strong>IBAN:</strong> {order.IBAN}
          </p>

          <div className={styles.productsBlock}>
            <h4>Products</h4>
            {order.products.length === 0 ? (
              <p>No products on this order.</p>
            ) : (
              <ul className={styles.productList}>
                {order.products.map((product) => (
                  <li key={product.id} className={styles.productItem}>
                    {product.name} x {product.quantity} ({product.size},{" "}
                    {product.color})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.actionsRow}>
            <select
              aria-label="Select order status"
              className={styles.statusSelect}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            >
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.editButton}
              onClick={() => handleEditOrderStatus()}
            >
              Edit Order Status
            </button>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsExpanded(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
