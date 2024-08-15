import { ReactNode, Suspense, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import routes, { Route } from '../constants/routes';
import supabase from '../supabase/service';
import useUserStore from '../store/userStore';

interface AuthenticationGuardProps {
	redirectTo: Route<typeof routes>;
	element: ReactNode;
}

const AuthenticationGuard = ({ redirectTo, element }: AuthenticationGuardProps) => {
	const { userInfo, setUserData } = useUserStore();
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

	useEffect(() => {
		const checkIsLogin = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					setIsLoggedIn(false);
					return;
				}

				setIsLoggedIn(true);
				setUserData({ id: user!.id, email: user?.email ?? userInfo.email });
			} catch (error) {
				console.error(error);
			}
		};

		checkIsLogin();
	}, [setUserData]);

	return !isLoggedIn ? <Navigate to={redirectTo} /> : <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
};

export default AuthenticationGuard;
