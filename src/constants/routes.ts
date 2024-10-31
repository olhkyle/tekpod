const routes = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	FILM_RECIPE: '/film_recipe',
	DIARY: '/diary',
	WRITE: '/write',
	USER: '/profile',
} as const;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Route<T> = T[keyof T] | (string & {});

export default routes;
