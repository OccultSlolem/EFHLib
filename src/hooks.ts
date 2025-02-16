import { useState } from 'react';

/**
 * Custom hook to use local storage. Can support any JSON serializable value.
 * Hook will update when the value in local storage changes, even if it was changed by another tab.
 * 
 * @param key The key to store the value in local storage
 * @param initialValue The initial value to use if the key is not found in local storage
 * @returns The stored value and a function to update it
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  // Lazy initialization of the state
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  function setValue(value: T){
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  window.addEventListener('storage', (event) => {
    if (event.key === key) {
      setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
    }
  });

  return [storedValue, setValue];
}
