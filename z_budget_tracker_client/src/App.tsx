import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavBar></NavBar>
      <div className="p-3 w-[75%] mx-auto">
        <Outlet></Outlet>
      </div>
    </QueryClientProvider>
  );
}

export default App;
