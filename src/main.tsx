import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router/Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create and export QueryClient for debugging
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Only retry once on failure (default is 3)
      retryDelay: 1000, // Wait 1 second before retrying
    },
  },
})

// Expose to window for debugging (remove in production)
if (import.meta.env.DEV) {
  (window as any).queryClient = queryClient
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </StrictMode>,
)
