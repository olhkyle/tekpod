import { Navigate, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import routes from '../../constants/routes';

const RouteError = () => {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return <Navigate to={routes.HOME} replace={true} />;
	}

	if (error) {
		switch (error instanceof Error && error.name) {
			case 'Invalid login credentials':
				return <Navigate to={routes.LOGIN} replace={true} />;

			default:
				return <Navigate to={routes.HOME} replace={true} />;
		}
	}

	return <Navigate to="/*" replace={true} />;
};

export default RouteError;
