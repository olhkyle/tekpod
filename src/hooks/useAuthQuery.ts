import { useSuspenseQuery } from '@tanstack/react-query';
import supabase from '../supabase/service';
import useUserStore from '../store/userStore';
import queryKey from '../constants/queryKey';

const STALE_TIME = 1000;
const GC_TIME = 1000 * 2;

const useAuthQuery = () => {
	const { setUserData } = useUserStore();

	// 1. fetching to check if it's authenticated
	// 2. if it's authenticated, set Global State
	const { data, isFetched, isLoading, error, refetch } = useSuspenseQuery({
		queryKey: queryKey.AUTH,
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
		staleTime: STALE_TIME,
		gcTime: GC_TIME,
	});

	return { data, isFetched, isLoading, error, refetch };
};

export default useAuthQuery;
