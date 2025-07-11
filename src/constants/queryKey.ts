const queryKey = {
	AUTH: ['auth'],
	USER: ['userInfo'],
	DIARY_PAGE_INFO: ['diary_pagination', 'pageInfo'],
	DIARY: ['diary'],
	DIARY_BY_PAGE: ['diaryByPage'],
	FILM_RECIPE: ['film_recipes'],
	TODOS_PAGE_INFO: ['todos_pagination', 'todosInfo'],
	TODOS: ['todos'],
	TODOS_BY_PAGE: ['todosByPage'],
	ALARM: ['alarm'],
	EXPENSE_TRACKER: ['expense_tracker'],
	COMMUTE_RECORDS: ['commute_records'],
} as const;

export default queryKey;
