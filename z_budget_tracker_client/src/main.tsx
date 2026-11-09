import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/routes.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientAuthProvider } from './contexts/ClientAuthContext.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ThemeProvider from './contexts/ThemeContext.tsx';
const main = () => {
  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <div className="dark:bg-slate-100 min-h-lvh">
        <ClientAuthProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
              <RouterProvider router={router}></RouterProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </ClientAuthProvider>
      </div>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(main());

//
//   </StrictMode>,
