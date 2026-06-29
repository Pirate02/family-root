import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email({
    message: "Invalid email address.",
  }),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters long")
    .max(64, "Password too long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
});

export const createFamilySchema = z.object({
  name: z
    .string()
    .min(1, "Family name is required")
    .max(100, "Family name too long !"),
});

export const createPersonSchema = z.object({
  name: z.string().min(1, "name is requied"),
  gender: z.enum(["male", "female", "others"]),
  picUrl: z.string().optional(),
  bio: z.string().optional(),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  dod: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
});
