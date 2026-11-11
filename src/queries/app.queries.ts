import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Throw away ALL cached server data and download it again.
 * Used by Settings → "Reset cached data". Handy while testing with DummyJSON,
 * because it brings back the original server data.
 */
export function useResetServerData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => queryClient.resetQueries(),
  });
}
