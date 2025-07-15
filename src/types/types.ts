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
}

