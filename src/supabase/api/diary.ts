import supabase from '../service';
import { Diary } from '../schema';

const TABLE = import.meta.env.VITE_SUPABASE_DB_TABLE_DIARY;
const DIARY_PAGE_SIZE = 10;

const getDiariesPageInfo = async () => {
	const { data, error } = await supabase.from(TABLE).select('*').explain({ format: 'json', analyze: true });

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const getDiariesByPage = async (pageParam: number, pageSize: number): Promise<Diary[]> => {
	const { data, error } = await supabase
		.from(TABLE)
		.select('*')
		.order('created_at', { ascending: false })
		.range((pageParam - 1) * pageSize, pageParam * pageSize - 1);

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const getSingleDiary = async (id: string): Promise<Diary> => {
	const { data, error } = await supabase.from(TABLE).select().eq('id', id).single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addDiary = async (data: Omit<Diary, 'id'>) => {
	return await supabase.from(TABLE).insert(data).select();
};

const updateDiary = async (data: Diary) => {
	return await supabase.from(TABLE).update(data).eq('id', data.id).select();
};

const removeDiary = async ({ id }: { id: string }) => {
	return await supabase.from(TABLE).delete().eq('id', id);
};

export { DIARY_PAGE_SIZE, getDiariesPageInfo, getDiariesByPage, getSingleDiary, addDiary, updateDiary, removeDiary };
