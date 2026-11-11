import { ApiError } from '@/api';

import { productsService } from '../products.service';

/**
 * The service layer has no React in it, so we can test it with a fake `fetch`.
 */
const product = {
  id: 1,
  title: 'Essence Mascara',
  description: 'Volumizing mascara',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 99,
  thumbnail: 'https://example.com/thumb.webp',
  images: [],
  tags: ['beauty'],
};

function mockFetchOnce(body: unknown, status = 200) {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  });
}

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

describe('productsService', () => {
  it('lists products with pagination params', async () => {
    mockFetchOnce({ products: [product], total: 1, skip: 0, limit: 20 });

    const result = await productsService.list({ limit: 20, skip: 0 });

    expect(result.products[0]?.title).toBe('Essence Mascara');
    expect((globalThis.fetch as jest.Mock).mock.calls[0][0]).toBe(
      'https://dummyjson.com/products?limit=20&skip=0'
    );
  });

  it('uses the search endpoint when a search term is given', async () => {
    mockFetchOnce({ products: [], total: 0, skip: 0, limit: 20 });

    await productsService.list({ limit: 20, skip: 0, search: 'phone' });

    expect((globalThis.fetch as jest.Mock).mock.calls[0][0]).toBe(
      'https://dummyjson.com/products/search?limit=20&skip=0&q=phone'
    );
  });

  it('sends JSON when creating a product', async () => {
    mockFetchOnce({ id: 195, title: 'New', price: 5 });

    const created = await productsService.create({
      title: 'New',
      description: 'A brand new product',
      price: 5,
      stock: 1,
      category: 'beauty',
    });

    const [, init] = (globalThis.fetch as jest.Mock).mock.calls[0];
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).title).toBe('New');
    expect(created.id).toBe(195);
  });

  it('turns a 404 into an ApiError with the server message', async () => {
    mockFetchOnce({ message: "Product with id '999' not found" }, 404);

    const error = await productsService.getById(999).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe('http');
    expect(error.isNotFound).toBe(true);
    expect(error.message).toBe("Product with id '999' not found");
  });

  it('turns an unexpected response shape into a parse error', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {}); // expected warning
    mockFetchOnce({ unexpected: true });

    const error = await productsService.getById(1).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe('parse');
  });

  it('turns a failed connection into a network error', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Network request failed'));

    const error = await productsService.getById(1).catch((e) => e);

    expect(error.kind).toBe('network');
  });
});
