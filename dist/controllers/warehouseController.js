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
const helper_1 = require("../utils/helper");
const warehouse_1 = __importDefault(require("../models/warehouse"));
const validation_1 = require("../zod/validation");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
class WarehouseController {
    constructor() {
        this.createWarehouse = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = validation_1.createWarehouseSchema.safeParse(req.body);
            if (!parsed.success) {
                throw parsed.error;
            }
            const { warehouseName, location, capacity } = parsed.data;
            const userRole = req.userRole;
            if (userRole !== 'admin') {
                return (0, helper_1.responseHandler)(res, 403, 'Access denied. Only admins can create warehouses.');
            }
            const newWarehouse = yield warehouse_1.default.create({
                warehouseName,
                location,
                capacity,
            });
            return (0, helper_1.responseHandler)(res, 201, 'Warehouse created successfully', newWarehouse);
        }));
        this.getAll = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userRole = req.userRole;
            if (userRole !== 'admin') {
                return (0, helper_1.responseHandler)(res, 403, 'Access denied. Only admins can create warehouses.');
            }
            const warehouses = yield warehouse_1.default.find();
            return (0, helper_1.responseHandler)(res, 200, 'All warehouses retrieved', warehouses);
        }));
        this.getById = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            zod_1.z.string().parse(id);
            const userRole = req.userRole;
            if (userRole !== 'admin') {
                return (0, helper_1.responseHandler)(res, 403, 'Access denied. Only admins can warehouses.');
            }
            if (typeof id !== 'string') {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid warehouse ID');
            }
            // Validate MongoDB ObjectId
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid warehouse ID');
            }
            const warehouse = yield warehouse_1.default.findById(id);
            if (!warehouse) {
                return (0, helper_1.responseHandler)(res, 404, 'Warehouse not found');
            }
            return (0, helper_1.responseHandler)(res, 200, 'Warehouse found', warehouse);
        }));
        this.update = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = validation_1.updateWarehouseSchemaWithId.safeParse(req.body);
            if (!parsed.success) {
                throw parsed.error;
            }
            const _a = parsed.data, { id } = _a, updateData = __rest(_a, ["id"]);
            const userRole = req.userRole;
            if (userRole !== 'admin') {
                return (0, helper_1.responseHandler)(res, 403, 'Access denied. Only admins can warehouses.');
            }
            if (typeof id !== 'string' || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid warehouse ID');
            }
            const updatedWarehouse = yield warehouse_1.default.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!updatedWarehouse) {
                return (0, helper_1.responseHandler)(res, 404, 'Warehouse not found');
            }
            return (0, helper_1.responseHandler)(res, 200, 'Warehouse updated successfully', updatedWarehouse);
        }));
        this.delete = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid or missing warehouse ID');
            }
            const warehouse = yield warehouse_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            if (!warehouse) {
                return (0, helper_1.responseHandler)(res, 404, 'Warehouse not found');
            }
            return (0, helper_1.responseHandler)(res, 200, 'Warehouse soft-deleted successfully', warehouse);
        }));
    }
}
exports.default = new WarehouseController();
