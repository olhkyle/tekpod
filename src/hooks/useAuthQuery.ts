import { useSuspenseQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useUserStore } from '../store';
import { queryKey } from '../constants';

const STALE_TIME = 1000 * 60 * 5; // 5 min
const GC_TIME = 1000 * 60 * 15; // 15 min

const useAuthQuery = () => {
	const { setUserData } = useUserStore();

	// 1. fetching to check if it's authenticated
	// 2. if it's authenticated, set Global State
	const authQuery = useSuspenseQuery({
		queryKey: queryKey.AUTH,
		queryFn: async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				throw new Error(error?.message ?? 'Not Validated Session');
			}

			const {
				data: { user },
				error: getUserError,
			} = await supabase.auth.getUser();

			if (!user || getUserError) {
				return null;
			}

			setUserData(session);
			return session;
		},
		staleTime: STALE_TIME,
		gcTime: GC_TIME,
	});

	return authQuery;
};

export default useAuthQuery;
