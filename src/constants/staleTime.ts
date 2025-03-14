const ONE_SECOND = 1000;

const staleTime = {
	DIARY: {
		PAGE_INFO: ONE_SECOND * 3,
		ALL_WITH_PAGINATION: ONE_SECOND * 5,
	},
	EXPENSE_TRACKER: {
		TOTAL_EXPENSE_PRICE: ONE_SECOND * 5,
		BY_MONTH: ONE_SECOND * 5,
	},
};

export default staleTime;
