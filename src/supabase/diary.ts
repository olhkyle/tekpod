import supabase from './service';
import { Diary } from './schema';

const TABLE = 'diary';

const getDiaries = async (): Promise<Diary[]> => {
	const { data } = await supabase.from(TABLE).select();

	return data?.sort((prev, curr) => new Date(curr.updated_at).getTime() - new Date(prev.updated_at).getTime()) ?? [];
};

const getSingleDiary = async (id: string) => {
	const { data } = await supabase.from(TABLE).select().eq('id', id).single();

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
