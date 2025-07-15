import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {asyncHandler, responseHandler } from '../utils/helper';
import productModel from '../models/product';
import {createProductSchema, updateProductSchema} from '../zod/validation';;

class ProductController {
    create = asyncHandler(async (req: Request, res: Response) => {
        const parsed = createProductSchema.safeParse(req.body);

        if (!parsed.success) throw parsed.error;

        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return responseHandler(res, 403, 'Access denied. Only admins can create products.');
        }

        const product = await productModel.create(parsed.data);

        return responseHandler(res, 201, 'Product created successfully', product);
    })

    getAll = asyncHandler(async (_req: Request, res: Response) => {
        const products = await productModel.aggregate([
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
        ])

        if (!products || products.length === 0) {
            return responseHandler(res, 404, 'No products found');
        }

        return responseHandler(res, 200, 'All products fetched', products);
    })

    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.query;

        if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
            return responseHandler(res, 400, 'Invalid product ID');
        }

        const product = await productModel.aggregate([
            {
                $match: { 
                    isDeleted: false ,
                    _id: new mongoose.Types.ObjectId(id)
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
        ])

        if (!product || product.length === 0) {
            return responseHandler(res, 404, 'Product not found');
        }

        return responseHandler(res, 200, 'Product fetched successfully', product[0]);
    })

    update = asyncHandler(async (req: Request, res: Response) => {
        const parsed = updateProductSchema.safeParse(req.body);
        if (!parsed.success) throw parsed.error;

        const { id, ...updateData } = parsed.data;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return responseHandler(res, 400, 'Invalid product ID');
        }

        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return responseHandler(res, 403, 'Access denied. Only admins can create products.');
        }

        const updated = await productModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return responseHandler(res, 404, 'Product not found');
        }

        return responseHandler(res, 200, 'Product updated successfully', updated);
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return responseHandler(res, 400, 'Invalid product ID');
        }

        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return responseHandler(res, 403, 'Access denied. Only admins can create products.');
        }

        const deleted = await productModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!deleted) {
            return responseHandler(res, 404, 'Product not found');
        }

        return responseHandler(res, 200, 'Product soft-deleted successfully', deleted);

    })
}


export default new ProductController();
