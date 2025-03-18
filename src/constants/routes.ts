const routes = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	FILM_RECIPE: '/film_recipe',
	DIARY: '/diary',
	WRITE: '/write',
	USER: '/mypage',
	PROFILE: 'profile',
	TODO_REMINDER: '/todo_reminder',
	EXPENSE_TRACKER: '/expense',
	EXPENSE_TRACKER_BY_MONTH: '/expense/daily',
	UPDATE_PASSWORD: 'update-password',
} as const;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Route<T> = T[keyof T] | (string & {});
export { routes };
