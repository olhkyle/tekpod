import supabase from './service';
import { Diary } from './schema';

const TABLE = 'diary';
const PAGE_SIZE = 10;

const getCommitStatus = async () => {
	const { data, error } = await supabase.from(TABLE).select('*');

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

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
		.order('updated_at', { ascending: false })
		.range((pageParam - 1) * pageSize, pageParam * pageSize - 1);
	/**
	 * select('*').range((page - 1) * 10, page * 9)
		.order('created_at', { ascending: false });
	 */

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

export { PAGE_SIZE, getCommitStatus, getDiariesPageInfo, getDiariesByPage, getSingleDiary, addDiary, updateDiary, removeDiary };
