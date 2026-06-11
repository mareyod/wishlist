import { ErrorBoundary } from './error/ErrorBoundary';
import { AuthProvider } from './auth/AuthProvider';
import { ModalProvider } from './modal/ModalProvider';

import type { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ModalProvider>
              {children}
        </ModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}