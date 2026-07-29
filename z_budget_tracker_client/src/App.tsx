import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Budget from './features/Budget/Budget';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Budget></Budget>
    </QueryClientProvider>
  );
}

export default App;
