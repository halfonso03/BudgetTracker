import { useEffect, useCallback } from 'react';

type EscapeKeyCallback = (event: KeyboardEvent) => void;

export function useEscapeKey(callback: EscapeKeyCallback): void {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      callback(event);
    }
  }, [callback]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
