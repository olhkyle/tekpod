import { ReactNode, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner, NotAuthenticated } from '../components';
import { useAuthQuery } from '../hooks';
import routes, { Route } from '../constants/routes';

interface AuthenticationGuardProps {
	redirectTo: Route<typeof routes>;
	element: ReactNode;
}

const AuthenticationGuard = ({ redirectTo, element }: AuthenticationGuardProps) => {
	const {
		authQuery: { data, isFetched, isLoading, error },
	} = useAuthQuery();

	return isLoading ? (
		<LoadingSpinner />
	) : isFetched && data ? (
		error === null ? (
			<Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
		) : (
			<Navigate to={redirectTo} />
		)
	) : (
		<NotAuthenticated />
	);
};

export default AuthenticationGuard;
