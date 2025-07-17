"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = exports.updateWarehouseSchemaWithId = exports.createWarehouseSchema = exports.userLoginSchema = exports.userRegisterSchema = void 0;
const zod_1 = require("zod");
exports.userRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    userName: zod_1.z.string().min(3, 'Username must be at least 3 characters'),
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    roles: zod_1.z.string().optional(),
    location: zod_1.z.object({
        type: zod_1.z.literal('Point'),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]), // [longitude, latitude]
    }),
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.createWarehouseSchema = zod_1.z.object({
    warehouseName: zod_1.z.string().min(2),
    location: zod_1.z.object({
        type: zod_1.z.literal('Point'),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]), // [longitude, latitude]
    }),
    capacity: zod_1.z.number().min(0),
});
exports.updateWarehouseSchemaWithId = exports.createWarehouseSchema.partial().extend({
    id: zod_1.z.string().min(1, "Warehouse ID is required"),
});
exports.createProductSchema = zod_1.z.object({
    productName: zod_1.z.string().min(2),
    price: zod_1.z.number().min(0),
    quantity: zod_1.z.number().min(0),
    description: zod_1.z.string().optional(),
    warehouseId: zod_1.z.string().min(1),
});
exports.updateProductSchema = exports.createProductSchema.partial().extend({
    id: zod_1.z.string().min(1),
});
