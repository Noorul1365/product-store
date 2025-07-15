import { z } from 'zod';

export const userRegisterSchema = z.object({
  name: z.string().optional(),
  userName: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roles: z.string().optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
  }),
});


export const userLoginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createWarehouseSchema = z.object({
  warehouseName: z.string().min(2),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
  }),
  capacity: z.number().min(0),
});

export const updateWarehouseSchemaWithId = createWarehouseSchema.partial().extend({
  id: z.string().min(1, "Warehouse ID is required"),
});