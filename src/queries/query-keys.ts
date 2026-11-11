/**
 * QUERY KEYS - the "address" of every piece of cached server data.
 *
 * Always build keys with this factory instead of typing arrays by hand.
 * Keys are hierarchical, so you can target groups of queries:
 *
 *   productKeys.all            ['products']                     -> everything about products
 *   productKeys.lists()        ['products', 'list']             -> every list (any search term)
 *   productKeys.list({...})    ['products', 'list', {search}]   -> one specific list
 *   productKeys.detail(1)      ['products', 'detail', 1]        -> one product
 *   productKeys.topRated()     ['products', 'top-rated']        -> home screen carousel
 *
 * e.g. `queryClient.invalidateQueries({ queryKey: productKeys.lists() })`
 * refreshes all product lists at once.
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: { search: string }) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  topRated: () => [...productKeys.all, 'top-rated'] as const,
};
