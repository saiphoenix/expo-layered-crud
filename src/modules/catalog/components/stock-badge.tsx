import { Badge } from '@/shared/ui/badge';
import { Text } from '@/shared/ui/text';

const LOW_STOCK_LIMIT = 10;

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <Badge variant="destructive">
        <Text>Out of stock</Text>
      </Badge>
    );
  }
  if (stock < LOW_STOCK_LIMIT) {
    return (
      <Badge variant="outline">
        <Text>Only {stock} left</Text>
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <Text>{stock} in stock</Text>
    </Badge>
  );
}
