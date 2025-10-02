import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Toaster } from 'sonner';
import ControlLayout from './layout/ControlLayout';
import AuthButton from './components/ui/global/AuthButton';

function App() {

  const client = new QueryClient();

  return (
      <QueryClientProvider client={client}>
        <ControlLayout>
          <AuthButton/>
        </ControlLayout>
          <Toaster/>
      </QueryClientProvider>
  )
}

export default App
