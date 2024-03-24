const routes = {
	HOME: '/',
	LOGIN: '/signin',
	REGISTER: '/register',
	USER: '/user/:id',
} as const;

export type Route<T> = T[keyof T];

export default routes;
