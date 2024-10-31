const getCalculatedTotalPage = (pagination: unknown, pageSize: number) => {
	const getTotalRows = () => {
		if (Array.isArray(pagination)) {
			const plan = pagination[0].Plan;
			return plan.Plans[0]['Actual Rows'];
		}

		return 0;
	};

	const calculatedTotalPage = Math.max(1, Math.ceil(getTotalRows() / pageSize));

	return calculatedTotalPage;
};

export default getCalculatedTotalPage;
