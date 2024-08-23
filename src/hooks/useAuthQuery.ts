import { useSuspenseQuery } from '@tanstack/react-query';
import supabase from '../supabase/service';
import useUserStore from '../store/userStore';

const useAuthQuery = () => {
	const { setUserData } = useUserStore();

	// 1. fetching to check if it's authenticated
	// 2. if it's authenticated, set Global State
	const { data, isFetched, isLoading, error, refetch } = useSuspenseQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error) {
					throw new Error(error.message);
				}

				setUserData(session);
				return session;
			} catch (error) {
				console.error(error);
			}
		},
		gcTime: 1000 * 5,
	});

	return { data, isFetched, isLoading, error, refetch };
};

export default useAuthQuery;
