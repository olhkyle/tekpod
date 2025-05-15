import { useQueryClient } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { queryKey } from '../constants';

const useClientSession = () => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(queryKey.AUTH) as Session;

	return { queryClient, session };
};

export default useClientSession;
