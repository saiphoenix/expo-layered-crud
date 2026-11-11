import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  API schemas - describe what the SERVER sends us                           */
/* -------------------------------------------------------------------------- */

/**
 * A product as returned by DummyJSON.
 * Only the fields the app uses are listed; Zod drops the rest.
 * Optional fields get defaults because a freshly created product
 * only contains the fields we sent.
 */
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().default(''),
  category: z.string().default('uncategorized'),
  price: z.number(),
  discountPercentage: z.number().default(0),
  rating: z.number().default(0),
  stock: z.number().default(0),
  brand: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export const productListResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const categoryListSchema = z.array(categorySchema);

export type Product = z.output<typeof productSchema>;
export type ProductListResponse = z.output<typeof productListResponseSchema>;
export type Category = z.output<typeof categorySchema>;

/* -------------------------------------------------------------------------- */
/*  Form schema - describes what the USER types in the create / edit form     */
/* -------------------------------------------------------------------------- */

/** Text inputs give us strings; this turns "12.50" into 12.5 and validates it. */
const numberFromText = (label: string, { integer = false } = {}) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => !Number.isNaN(Number(value)), `${label} must be a number`)
    .transform(Number)
    .refine((value) => value >= 0, `${label} cannot be negative`)
    .refine((value) => !integer || Number.isInteger(value), `${label} must be a whole number`);

export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(80, 'Title must be 80 characters or less'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be 500 characters or less'),
  price: numberFromText('Price').refine((value) => value > 0, 'Price must be greater than 0'),
  stock: numberFromText('Stock', { integer: true }),
  category: z.string().min(1, 'Please choose a category'),
  brand: z.string().trim().max(40, 'Brand must be 40 characters or less').optional(),
});

/** What the form fields hold (strings). */
export type ProductFormInput = z.input<typeof productFormSchema>;
/** What we get after validation (numbers converted) - this is sent to the API. */
export type ProductFormValues = z.output<typeof productFormSchema>;

/** Body for POST /products/add and PUT /products/:id */
export type ProductPayload = ProductFormValues;

/** Convert an existing product into form default values (used by the edit screen). */
export function productToFormInput(product: Product): ProductFormInput {
  return {
    title: product.title,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    category: product.category,
    brand: product.brand ?? '',
  };
}

export const emptyProductForm: ProductFormInput = {
  title: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  brand: '',
};
