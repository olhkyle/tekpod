import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDiary } from '../../supabase/diary';
import { Diary } from '../../supabase/schema';
import queryKey from '../../constants/queryKey';

const add = (data: Diary) => (oldData: Diary[]) => {
	return [...oldData, data];
};

// 현재 상황에서는 별도의 페이지에서 작성하고 있기 때문에, mutation이 필요 없을 수 있음
const useAddDiaryMutation = () => {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: async (variables: Diary) => {
			await addDiary(variables);
		},
		async onMutate(variables) {
			// Cancel any outgoing refetch
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: queryKey.DIARY_BY_PAGE });
			const previousData = queryClient.getQueryData(queryKey.DIARY_BY_PAGE);

			if (previousData) {
				queryClient.setQueryData(queryKey.DIARY_BY_PAGE, add(variables));
			}

			return { previousData };
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(queryKey.DIARY_BY_PAGE, context?.previousData);
			}
		},
		// Always refetch after error or success:
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.DIARY_BY_PAGE });
		},
	});
	return mutate;
};

export default useAddDiaryMutation;
