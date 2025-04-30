const queryKey = {
	AUTH: ['auth'],
	USER: ['userInfo'],
	PAGE_INFO: ['pageInfo'],
	DIARY: ['diary'],
	DIARY_BY_PAGE: ['diaryByPage'],
	FILM_RECIPE: ['film_recipes'],
	TODOS: ['todos'],
	EXPENSE_TRACKER: ['expense_tracker'],
	COMMUTE_RECORDS: ['commute_records'],
} as const;

export default queryKey;
