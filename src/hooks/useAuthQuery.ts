import { useQuery } from '@tanstack/react-query';
import useUserStore from '../store/userStore';
import supabase from '../supabase/service';

const useAuthQuery = () => {
	const { userInfo, setUserData } = useUserStore();

	const authQuery = useQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (user) {
					setUserData({ id: user!.id, email: user?.email ?? userInfo.email });
				}

				return user;
			} catch (error) {
				console.error(error);
			}
		},
	});

	return { userInfo, setUserData, authQuery };
};

export default useAuthQuery;
