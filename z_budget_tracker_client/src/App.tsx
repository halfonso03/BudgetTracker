import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavBar></NavBar>
        <div className="p-3 w-[82%] mx-auto">
          <Outlet></Outlet>
        </div>
        <Toaster
          gutter={12}
          containerStyle={{
            margin: '8px',
            position: 'absolute',
            top: '250px',
          }}
          toastOptions={{
            success: {
              duration: 1500,
            },
            error: {
              duration: 3000,
            },

            style: {
              fontSize: '18px',
              maxWidth: '500px',
              padding: '20px 20px',
              borderRadius: '3px',
              border: '2px solid var(--color-neutral-400)',
            },
          }}
        ></Toaster>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
