import { productFormSchema, productSchema } from '../product.schema';

describe('productFormSchema', () => {
  const valid = {
    title: 'Wireless Headphones',
    description: 'Great sound and long battery life.',
    price: '49.99',
    stock: '12',
    category: 'mobile-accessories',
    brand: 'Acme',
  };

  it('converts text inputs into numbers', () => {
    const result = productFormSchema.parse(valid);
    expect(result.price).toBe(49.99);
    expect(result.stock).toBe(12);
  });

  it('rejects a price that is not a number', () => {
    const result = productFormSchema.safeParse({ ...valid, price: 'abc' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Price must be a number');
  });

  it('rejects stock with decimals', () => {
    const result = productFormSchema.safeParse({ ...valid, stock: '1.5' });
    expect(result.success).toBe(false);
  });

  it('requires a category', () => {
    const result = productFormSchema.safeParse({ ...valid, category: '' });
    expect(result.error?.issues[0]?.message).toBe('Please choose a category');
  });
});

describe('productSchema', () => {
  it('fills defaults for fields a freshly created product does not have', () => {
    const product = productSchema.parse({ id: 1, title: 'X', price: 10 });
    expect(product.images).toEqual([]);
    expect(product.rating).toBe(0);
  });
});
