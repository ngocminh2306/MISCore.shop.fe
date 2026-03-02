import { ProductDto } from "../../public-api";

export interface CartItem {
  product: ProductDto;
  quantity: number;
}