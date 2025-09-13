import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2,'Username must be at least 2 characters')
.max(20, 'Username must be not more than 20 characters')
.regex(/^\S+@\S+\.\S+$/, "username must not contain special charcter")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email('Invalid email address'),
    password: z.string().min(6,'Password must contain at least 6 characters')
})