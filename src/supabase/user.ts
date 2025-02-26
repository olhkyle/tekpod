import supabase from './service';
import { RegisterSchema } from '../components/auth/schema';

const TABLE = 'users';

const isUserExist = async (email: string) => {
	return await supabase.from(TABLE).select('email').eq('email', email);
};

const addNewUser = async ({ userId, userData }: { userId?: string; userData: RegisterSchema }) => {
	return await supabase.from(TABLE).insert({ user_id: userId, email: userData.email, nickname: userData.nickname });
};

export { isUserExist, addNewUser };
