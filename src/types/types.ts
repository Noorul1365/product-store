import mongoose, {Document} from "mongoose";

export interface User extends Document {
    name?: string;
    userName: string;
    email: string;
    password: string;
    roles?: string;
    location: {
      type: string;
      coordinates: number[];
    };
    accessToken?: string;
}

export interface Warehouse extends Document {
    warehouseName: string;
    capacity: number;
    location: {
      type: string;
      coordinates: number[];
    };
    isDeleted?: boolean;
}

export interface Product extends Document {
  productName: string;
  price: number;
  quantity: number;
  description?: string;
  warehouseId: mongoose.Types.ObjectId;
  isDeleted?: boolean;
}

export interface Order extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  cartItems: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

