import { useSuspenseQuery } from '@tanstack/react-query';
import supabase from '../supabase/service';
import useUserStore from '../store/userStore';
import queryKey from '../constants/queryKey';

const STALE_TIME = 1000 * 60; // 1 min
const GC_TIME = 1000 * 60 * 5; // 5 min

const useAuthQuery = () => {
	const { setUserData } = useUserStore();

	// 1. fetching to check if it's authenticated
	// 2. if it's authenticated, set Global State
	const { data, isFetched, isLoading, error, refetch } = useSuspenseQuery({
		queryKey: queryKey.AUTH,
		queryFn: async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				throw new Error(error?.message ?? 'Not Validated Session');
			}

			if (!session) {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					return null;
				}
			}
			setUserData(session);
			return session;
		},
		staleTime: STALE_TIME,
		gcTime: GC_TIME,
	});

	return { data, isFetched, isLoading, error, refetch };
};

export default useAuthQuery;
