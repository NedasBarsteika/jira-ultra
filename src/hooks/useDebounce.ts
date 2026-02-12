// Custom hooks
import { useEffect, useState } from "react";

/**
 * Debounces a value by the given delay.
 * Useful for search inputs, auto-save, etc.
 *
 * Example:
 *   const debouncedQuery = useDebounce(searchQuery, 300);
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
