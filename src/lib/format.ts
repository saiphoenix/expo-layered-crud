const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatPrice(value: number) {
  return currency.format(value);
}

/** Price after discount, e.g. 100 with 10% off -> 90 */
export function discountedPrice(price: number, discountPercentage: number) {
  return price * (1 - discountPercentage / 100);
}

/** "smart-phones" -> "Smart Phones" */
export function humanize(slug: string) {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join(' ');
}
