import { useEffect, useRef } from 'react';

export function useOutsideClick<HTMLDivElement>(handler: () => void, listenCapturing = true) {
  const ref = useRef<HTMLDivElement | null>(null);


  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        const element = ref.current as Node | null;

        if (
          element &&
          e.target instanceof Node &&
          !element.contains(e.target)
        ) {
          handler();
        }
      }

      document.addEventListener('click', handleClick, listenCapturing);

      return () =>
        document.removeEventListener('click', handleClick, listenCapturing);
    },
    [handler, listenCapturing],
  );


  return ref;
}
