const routes = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	DIARY: '/diary',
	WRITE: '/write',
	USER: '/:id',
} as const;

export type Route<T> = T[keyof T];

export default routes;
