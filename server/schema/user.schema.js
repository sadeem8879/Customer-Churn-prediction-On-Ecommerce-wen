import { z } from "zod"
import prisma from "../database/db.js";

export const userschema = z
    .object({
        username: z
            .string({ message: "this field is required" })
            .min(3, { message: "Name should be atleast 3 character" })
            .max(15, { message: "Name should be 15 character only" })
            .regex(/^[a-zA-Z\s]+$/, { message: "Username should only contain letters and spaces" }),

        password: z
            .string({ message: "this field is required" })
            .min(6, { message: "password should be atleast 6 character" })
            .max(19, { message: "Name should be 19 character only" })
            .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
                message: "Password must contain at least one uppercase letter and one number",
            }),

        email: z
            .string({ message: "This field is required" })
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
                message: "Email must be a valid email address",
            }),
        role: z.enum(["user", "admin"]).optional(), // Role can be "user" or "admin", defaults to "user"

    });

export const loginschema = z
    .object({
        username: z
            .string({ message: "this field is required" })
            .min(3, { message: "Name should be atleast 3 character" })
            .max(15, { message: "Name should be 15 character only" })
            .regex(/^[a-zA-Z\s]+$/, { message: "Username should only contain letters and spaces" }),

        password: z
            .string({ message: "this field is required" })
            .min(6, { message: "password should be atleast 6 character" })
            .max(19, { message: "Name should be 19 character only" })
            .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
                message: "Password must contain at least one uppercase letter and one number",
            })
    });
export const checkoutSchema = z.object({
    name: z
        .string({ message: "This field is required" })
        .min(3, { message: "Name should be at least 3 characters" })
        .max(50, { message: "Name should be 50 characters or less" })
        .regex(/^[a-zA-Z\s]+$/, { message: "Name should only contain letters and spaces" }),

    email: z
        .string({ message: "This field is required" })
        .email({ message: "Email must be a valid email address" }),

    mobile: z
        .string({ message: "This field is required" })
        .refine((val) => /^\d{10}$/.test(val), {
            message: "Mobile number must be exactly 10 digits",
        }),

    address: z
        .string({ message: "This field is required" })
        .min(5, { message: "Address should be at least 5 characters" })
        .max(100, { message: "Address should be 100 characters or less" }),

    paymentMethod: z
        .enum(["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"], { message: "Invalid payment method selected" }),

    quantity: z
        .number({ message: "Quantity is required" })
        .min(1, { message: "Quantity must be at least 1" }),
});
