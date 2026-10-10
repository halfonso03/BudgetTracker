import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/routes.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientAuthProvider } from './contexts/ClientAuthContext.tsx';

const main = () => {
  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <ClientAuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}></RouterProvider>
        </QueryClientProvider>
      </ClientAuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(main());

//
//   </StrictMode>,
