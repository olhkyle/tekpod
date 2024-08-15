import supabase from './service';
import { Diary } from './schema';

const TABLE = 'diary';

const getDiaries = async (): Promise<Diary[]> => {
	const { data } = await supabase.from(TABLE).select();

	return data ?? [];
};

export { getDiaries };
