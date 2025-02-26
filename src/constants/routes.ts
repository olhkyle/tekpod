const routes = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	REFLECT: '/reflect',
	FILM_RECIPE: '/film_recipe',
	DIARY: '/diary',
	WRITE: '/write',
	USER: '/mypage',
	TODO_REMINDER: '/todo_reminder',
	EXPENSE_TRACKER: '/expense',
	UPDATE_PASSWORD: 'update-password',
} as const;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Route<T> = T[keyof T] | (string & {});

export default routes;
