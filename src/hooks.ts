import { useState } from 'react';

export function useLocalStorage(key: string, initialValue: string) {
  // Lazy initialization of the state
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  function setValue(value: string){
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  window.addEventListener('storage', (event) => {
    if (event.key === key) {
      setStoredValue(event.newValue);
    }
  });

  return [storedValue, setValue];
}
