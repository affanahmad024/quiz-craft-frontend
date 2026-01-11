// LocalStorage Hook
// Following Phoenix pattern for localStorage state management

import { useState, useEffect } from 'react';
import { saveToLS, getFromLS } from '../funcs/LSFuncs';

/**
 * LocalStorage hook
 * Syncs state with localStorage
 *
 * @param {string} key - LocalStorage key
 * @param {any} initialValue - Initial value
 * @returns {[any, function]} - [value, setValue]
 */
const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [value, setValue] = useState(() => {
    const stored = getFromLS(key);
    return stored !== null ? stored : initialValue;
  });

  // Update localStorage when value changes
  useEffect(() => {
    saveToLS(key, value);
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
