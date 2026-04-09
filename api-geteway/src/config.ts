export const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:4003";
export const PRODUCTS_SERVICE_URL =
  process.env.PRODUCTS_SERVICE_URL || "http://localhost:4001";
export const INVENTORY_SERVICE_URL =
  process.env.INVENTORY_SERVICE_URL || "http://localhost:4002";
export const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:4004";
export const EMAIL_SERVICE_URL =
  process.env.EMAIL_SERVICE_URL || "http://localhost:4005";
export const CART_SERVICE_URL =
  process.env.CART_SERVICE_URL || "http://localhost:4006";
export const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:4007";

export const DEFAULT_SERVICE_URL_MAP: Record<string, string> = {
  AUTH_SERVICE_URL: "http://localhost:4003",
  PRODUCTS_SERVICE_URL: "http://localhost:4001",
  INVENTORY_SERVICE_URL: "http://localhost:4002",
  USER_SERVICE_URL: "http://localhost:4004",
  EMAIL_SERVICE_URL: "http://localhost:4005",
  CART_SERVICE_URL: "http://localhost:4006",
  ORDER_SERVICE_URL: "http://localhost:4007",
};
