export const Size = {
    XS: "XS",
    S: "S",
    M: "M",
    L: "L",
    XL: "XL",
    XXL: "XXL",
    ONE_SIZE: "ONE_SIZE",
} as const;

export type Size = (typeof Size)[keyof typeof Size];
