// Debounce Hook
// Following Phoenix pattern for search input optimization

import { useState, useEffect } from 'prop-types';

/**
 * Debounce hook
 * Delays updating the value until after the specified delay
 *
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout on value change or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
