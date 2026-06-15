import { ErrorBoundary } from './error/ErrorBoundary';
import { AuthProvider } from './auth/AuthProvider';
import { ModalProvider } from './modal/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ModalProvider>
                {children}
          </ModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}