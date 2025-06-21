const routes = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	FILM_RECIPE: '/film_recipe',
	DIARY: '/diary',
	WRITE: '/write',
	USER: '/mypage',
	PROFILE: '/mypage/profile',
	UPDATE_PASSWORD: '/mypage/update-password',
	TODO_REMINDER: '/todo_reminder',
	EXPENSE_TRACKER: '/expense',
	EXPENSE_TRACKER_BY_MONTH: '/expense/daily',
	EXPENSE_TRACKER_REPORT: '/expense/report',
	COMMUTE_TRACKER: '/commute',
	FAVORITE_CAFE: '/cafes',
} as const;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Route<T> = T[keyof T] | (string & {});
export { routes };
