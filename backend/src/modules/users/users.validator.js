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

module.exports = { updateProfileSchema, updateRoleSchema, getUserByIdSchema };
