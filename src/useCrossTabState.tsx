import { useState, useEffect } from "react";

/**
 * Custom hook to manage state across multiple tabs/windows using localStorage.
 *
 * @template T - The type of the state value.
 * @param {string} stateKey - The key used to store the state in localStorage.
 * @param {T} value - The initial value of the state.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} - Returns the current state and a function to update it.
 *
 * @example
 * const [state, setState] = useCrossTabState('myStateKey', initialValue);
 *
 * @remarks
 * This hook synchronizes the state across different tabs/windows by listening to the "storage" event.
 * It saves the state to localStorage whenever it changes and updates the state when the corresponding
 * localStorage key is modified in another tab/window.
 *
 * @throws {Error} If there is an error saving the state to localStorage.
 */
export function useCrossTabState<T>(stateKey: string, value: T) {
  const [state, setState] = useState<T>(value);

  // first render
  useEffect(() => {
    localStorage.removeItem(stateKey);
  }, []);

  // Save the state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving state to localStorage", error);
    }
  }, [state]);

  // Update the state when the corresponding localStorage key is modified in any tab
  useEffect(() => {
    const onStorageUpdate = (e: StorageEvent) => {
      if (e.key === stateKey && e.newValue != null) {
        setState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", onStorageUpdate);
    // Clean up the event listener
    return () => {
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, [setState]);

  return [state, setState] as const;
}
