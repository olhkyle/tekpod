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
	const { data, isFetched, isLoading, error, refetch } = useAuthQuery();

	// data(session)이 null인 순간들이 발생할 때 refetch 하도록
	if (!data) {
		refetch();
		return null;
	}

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
