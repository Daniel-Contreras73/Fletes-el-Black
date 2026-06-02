const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
  }),
});

const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(["CLIENT", "TRANSPORTER", "ADMIN"]),
  }),
  params: z.object({
    id: z.string(),
  }),
});
const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    role: z.enum(["CLIENT", "TRANSPORTER", "ADMIN"]).optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    phone: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

module.exports = { updateProfileSchema, updateRoleSchema, getUserByIdSchema, createUserSchema, updateUserSchema };
