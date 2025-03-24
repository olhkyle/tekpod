import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDiary, type Diary } from '../../../supabase';
import { queryKey } from '../../../constants';

const add = (data: Diary) => (oldData: Diary[]) => {
	return [...oldData, data];
};

// mutation could be not in need, because some actions redirect to different page, not settling same page
const useAddDiaryMutation = () => {
	const queryClient = useQueryClient();
	const QUERY_KEY = queryKey.DIARY_BY_PAGE;

	const { mutate } = useMutation({
		mutationFn: async (variables: Diary) => {
			await addDiary(variables);
		},
		async onMutate(variables) {
			// Cancel any outgoing refetch
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });
			const previousData = queryClient.getQueryData(QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(QUERY_KEY, add(variables));
			}

			return { previousData };
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(QUERY_KEY, context?.previousData);
			}
		},
		// Always refetch after error or success:
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
	return mutate;
};

export default useAddDiaryMutation;
