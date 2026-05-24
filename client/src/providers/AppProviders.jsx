import { ErrorBoundary } from './error/ErrorBoundary';
import { AuthProvider } from './auth/AuthProvider';
import { ModalProvider } from './modal/ModalProvider';
export default function AppProviders({ children }) {
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