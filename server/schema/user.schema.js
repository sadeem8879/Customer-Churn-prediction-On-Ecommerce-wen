import { z } from "zod"

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
            .max(12, { message: "Name should be 12 character only" })
            .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
                message: "Password must contain at least one uppercase letter and one number",
            }),

        email: z
            .string({ message: "This field is required" })
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
                message: "Email must be a valid email address",
            }),
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
        .max(12, { message: "Name should be 12 character only" })
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/, {
            message: "Password must contain at least one uppercase letter and one number",
        })
});