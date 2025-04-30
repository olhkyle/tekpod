import { ReactNode } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback, Toast } from '..';

interface AppProviderProps {
	children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			{children}
			<Toast />
		</ErrorBoundary>
	);
};

export default AppProvider;
