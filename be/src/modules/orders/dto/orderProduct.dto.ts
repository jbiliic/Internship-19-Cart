import { Size } from "@prisma/client";

export class OrderProductDto {
    productId: number;
    quantity: number;
    selectedSize: Size;
}