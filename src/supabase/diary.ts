import supabase from './service';
import { Diary } from './schema';

const TABLE = 'diary';

// const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const getDiaries = async (): Promise<Diary[]> => {
	const { data, error } = await supabase.from(TABLE).select('*');
	/**
	 * select('*').range((page - 1) * 10, page * 9)
		.order('created_at', { ascending: false });
	 */

	if (error) {
		throw new Error(error.message);
	}

	return data?.sort((prev, curr) => new Date(curr.updated_at).getTime() - new Date(prev.updated_at).getTime()) ?? [];
};

const getSingleDiary = async (id: string): Promise<Diary> => {
	const { data, error } = await supabase.from(TABLE).select().eq('id', id).single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addDiary = async (data: Diary) => {
	return await supabase.from(TABLE).insert(data);
};

const updateDiary = async (data: Diary) => {
	return await supabase.from(TABLE).update(data).eq('id', data.id);
};

const removeDiary = async ({ id }: { id: string }) => {
	return await supabase.from(TABLE).delete().eq('id', id);
};

export { getDiaries, getSingleDiary, addDiary, updateDiary, removeDiary };
