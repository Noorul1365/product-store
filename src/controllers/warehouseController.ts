import { Request, Response } from 'express';
import { responseHandler, asyncHandler } from '../utils/helper';
import warehouseModel from '../models/warehouse';
import userModel from '../models/user';
import { createWarehouseSchema, updateWarehouseSchemaWithId } from '../zod/validation';
import mongoose from 'mongoose';
import { z } from "zod";

class WarehouseController {

    createWarehouse = asyncHandler(async (req: Request, res: Response) => {
        const parsed = createWarehouseSchema.safeParse(req.body);
        if (!parsed.success) {
            throw parsed.error;
        }

        const { warehouseName, location, capacity } = parsed.data;

        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return responseHandler(res, 403, 'Access denied. Only admins can create warehouses.');
        }

        const newWarehouse = await warehouseModel.create({
            warehouseName,
            location,
            capacity,
        });

        return responseHandler(res, 201, 'Warehouse created successfully', newWarehouse);
    })

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return responseHandler(res, 403, 'Access denied. Only admins can create warehouses.');
        }
        const warehouses = await warehouseModel.find();
        return responseHandler(res, 200, 'All warehouses retrieved', warehouses);
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.query;
        z.string().parse(id);

        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return responseHandler(res, 403, 'Access denied. Only admins can warehouses.');
        }

        if (typeof id !== 'string') {
            return responseHandler(res, 400, 'Invalid warehouse ID');
        }

    // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return responseHandler(res, 400, 'Invalid warehouse ID');
        }

        const warehouse = await warehouseModel.findById(id);

        if (!warehouse) {
            return responseHandler(res, 404, 'Warehouse not found');
        }

        return responseHandler(res, 200, 'Warehouse found', warehouse);
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const parsed = updateWarehouseSchemaWithId.safeParse(req.body);
        if (!parsed.success) {
            throw parsed.error;
        }
        const { id, ...updateData } = parsed.data;

        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return responseHandler(res, 403, 'Access denied. Only admins can warehouses.');
        }


        if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
            return responseHandler(res, 400, 'Invalid warehouse ID');
        }


        const updatedWarehouse = await warehouseModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedWarehouse) {
            return responseHandler(res, 404, 'Warehouse not found');
        }

        return responseHandler(res, 200, 'Warehouse updated successfully', updatedWarehouse);
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return responseHandler(res, 400, 'Invalid or missing warehouse ID');
        }

        const warehouse = await warehouseModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!warehouse) {
            return responseHandler(res, 404, 'Warehouse not found');
        }

        return responseHandler(res, 200, 'Warehouse soft-deleted successfully', warehouse);
    })
}

export default new WarehouseController();
