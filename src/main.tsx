import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AccentColorProvider } from './contexts/AccentColorContext';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AccentColorProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AccentColorProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
