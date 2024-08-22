import { ReactNode, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutLoadingSpinner, NotAuthenticated } from '../components';
import { useAuthQuery } from '../hooks';
import routes, { Route } from '../constants/routes';

interface AuthenticationGuardProps {
	redirectTo: Route<typeof routes>;
	element: ReactNode;
}

// As a role of Server-Side-Rendering's Middleware
const AuthenticationGuard = ({ redirectTo, element }: AuthenticationGuardProps) => {
	const { data, isFetched, isLoading, error } = useAuthQuery();

	if (isLoading) {
		return <LayoutLoadingSpinner />;
	}

	return data && isFetched ? (
		error === null ? (
			<Suspense fallback={<LayoutLoadingSpinner />}>{element}</Suspense>
		) : (
			<Navigate to={redirectTo} />
		)
	) : (
		<NotAuthenticated />
	);
};

export default AuthenticationGuard;
