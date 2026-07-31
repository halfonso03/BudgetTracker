import { useState } from 'react';

export function useClipboard(delay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported');
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), delay);
      return true;
    } catch (error) {
      console.error('Copy failed', error);
      return false;
    }
  };

  return { copy, copied };
}
