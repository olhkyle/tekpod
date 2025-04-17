import supabase from '../service';

const getMonthlyRecords = async ({ year, month, user_id }: { year: number; month: number; user_id: string }) => {
	const startDate = `${year}-${`${month}`.padStart(2, '0')}-01`;
	const endDate = `${year}-${`${month}`.padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

	const { data, error } = await supabase
		.from('commute_records')
		.select('*')
		.eq('user_id', user_id)
		.gte('date', startDate)
		.lte('date', endDate);

	if (error) throw error;

	return data;
};

export { getMonthlyRecords };
