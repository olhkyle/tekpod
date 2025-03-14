import { ReactNode, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutLoadingSpinner, NotAuthenticated } from '../components';
import { useAuthQuery } from '../hooks';
import { type Route, routes } from '../constants';

interface AuthenticationGuardProps {
	redirectTo: Route<typeof routes>;
	element: ReactNode;
}

// As a role of Server-Side-Rendering's Middleware
const AuthenticationGuard = ({ redirectTo, element }: AuthenticationGuardProps) => {
	const { data, isSuccess, isError, error } = useAuthQuery();

	if (!data || isError) {
		return <NotAuthenticated />;
	}

	return error === null && isSuccess ? <Suspense fallback={<LayoutLoadingSpinner />}>{element}</Suspense> : <Navigate to={redirectTo} />;
};

export default AuthenticationGuard;
