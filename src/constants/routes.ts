const routes = {
	HOME: '/',
	LOGIN: '/signin',
	REGISTER: '/register',
	USER: '/user/:id',
	BOOKMARK: '/user/:id/bookmark',
} as const;

export type Route<T> = T[keyof T];

export default routes;
