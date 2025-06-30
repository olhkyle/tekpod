import { CommuteRecord } from '../schema';
import supabase from '../service';

const TABLE = 'commute_records';

const getMonthlyRecords = async ({ year, month, user_id }: { year: number; month: number; user_id: string }): Promise<CommuteRecord[]> => {
	const startDate = `${year}-${`${month}`.padStart(2, '0')}-01`;
	const endDate = `${year}-${`${month}`.padStart(2, '0')}-${new Date(year, month, 0, 23, 59, 59, 999).getDate()}`;

	const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', user_id).gte('date', startDate).lte('date', endDate);

	if (error) throw error;

	return data;
};

const addCommute = async (data: Omit<CommuteRecord, 'id'>) => {
	const { error } = await supabase.from(TABLE).insert(data).select();

	if (error) {
		throw new Error(error.message);
	}
};

const updateCommute = async (data: Partial<CommuteRecord>) => {
	const { error } = await supabase
		.from(TABLE)
		.update({ ...data })
		.eq('id', data.id);

	if (error) {
		throw new Error(error.message);
	}
};

const removeCommute = async ({ id }: { id: string }) => {
	return await supabase.from(TABLE).delete().eq('id', id);
};

export { getMonthlyRecords, addCommute, updateCommute, removeCommute };
