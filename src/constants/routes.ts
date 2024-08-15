const routes = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	DIARY: '/diary',
	WRITE: '/write',
	USER: '/profile',
} as const;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Route<T> = T[keyof T] | (string & {});

export default routes;
