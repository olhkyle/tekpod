import { Navigate } from 'react-router-dom';
import { routes } from '../../constants';

const NotAuthenticated = () => {
	return <Navigate to={routes.LOGIN} />;
};

export default NotAuthenticated;
