export const orderStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED',
} as const;

export type OrderStatus = (typeof orderStatus)[keyof typeof orderStatus];