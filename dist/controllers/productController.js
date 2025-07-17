"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const helper_1 = require("../utils/helper");
const product_1 = __importDefault(require("../models/product"));
const validation_1 = require("../zod/validation");
;
class ProductController {
    constructor() {
        this.create = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = validation_1.createProductSchema.safeParse(req.body);
            if (!parsed.success)
                throw parsed.error;
            const userRole = req.userRole;
            if (userRole !== 'admin') {
                return (0, helper_1.responseHandler)(res, 403, 'Access denied. Only admins can create products.');
            }
            const product = yield product_1.default.create(parsed.data);
            return (0, helper_1.responseHandler)(res, 201, 'Product created successfully', product);
        }));
        this.getAll = (0, helper_1.asyncHandler)((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield product_1.default.aggregate([
                {
                    $match: { isDeleted: false }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouseDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$warehouseDetails',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);
            if (!products || products.length === 0) {
                return (0, helper_1.responseHandler)(res, 404, 'No products found');
            }
            return (0, helper_1.responseHandler)(res, 200, 'All products fetched', products);
        }));
        this.getById = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            if (typeof id !== 'string' || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid product ID');
            }
            const product = yield product_1.default.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        _id: new mongoose_1.default.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouseDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$warehouseDetails',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);
            if (!product || product.length === 0) {
                return (0, helper_1.responseHandler)(res, 404, 'Product not found');
            }
            return (0, helper_1.responseHandler)(res, 200, 'Product fetched successfully', product[0]);
        }));
        this.update = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = validation_1.updateProductSchema.safeParse(req.body);
            if (!parsed.success)
                throw parsed.error;
            const _a = parsed.data, { id } = _a, updateData = __rest(_a, ["id"]);
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid product ID');
            }
            const userRole = req.userRole;
            if (userRole !== 'admin') {
                return (0, helper_1.responseHandler)(res, 403, 'Access denied. Only admins can create products.');
            }
            const updated = yield product_1.default.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!updated) {
                return (0, helper_1.responseHandler)(res, 404, 'Product not found');
            }
            return (0, helper_1.responseHandler)(res, 200, 'Product updated successfully', updated);
        }));
        this.delete = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid product ID');
            }
            const userRole = req.userRole;
            if (userRole !== 'admin') {
                return (0, helper_1.responseHandler)(res, 403, 'Access denied. Only admins can create products.');
            }
            const deleted = yield product_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            if (!deleted) {
                return (0, helper_1.responseHandler)(res, 404, 'Product not found');
            }
            return (0, helper_1.responseHandler)(res, 200, 'Product soft-deleted successfully', deleted);
        }));
    }
}
exports.default = new ProductController();
