import supabase from '../service';
import { RegisterSchema, UpdateProfileSchema } from '../../components';

const TABLE = import.meta.env.VITE_SUPABASE_DB_TABLE_USERS;

const isUserExist = async (email: string) => {
	const { data, error } = await supabase.from(TABLE).select('email').eq('email', email);

	return { data: data?.length !== 0, error };
};

const getUser = async (userId: string) => {
	const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', userId).single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addNewUser = async ({ userId, userData }: { userId?: string; userData: RegisterSchema }) => {
	return await supabase.from(TABLE).insert({ user_id: userId, email: userData.email, nickname: userData.nickname });
};

const updateUser = async ({ userId, userData }: { userId: string; userData: UpdateProfileSchema }) => {
	return await supabase.from(TABLE).update(userData).eq('user_id', userId);
};

export { isUserExist, getUser, addNewUser, updateUser };
