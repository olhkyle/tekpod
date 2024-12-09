import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeDiary } from '../../supabase/diary';
import { Diary } from '../../supabase/schema';
import queryKey from '../../constants/queryKey';

const remove =
	({ id }: { id: string }) =>
	(oldData: Diary[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useDeleteDiaryMutation = () => {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		async mutationFn(variables: { id: string }) {
			await removeDiary(variables);
		},
		async onMutate(variables) {
			// Cancel any outgoing refetch
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: queryKey.DIARY });
			const previousData = queryClient.getQueryData(queryKey.DIARY);

			if (previousData) {
				queryClient.setQueryData(queryKey.DIARY, remove(variables));
			}

			return { previousData };
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(queryKey.DIARY, context?.previousData);
			}
		},
		// Always refetch after error or success:
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.DIARY });
		},
	});
	return { mutate, isPending };
};

export default useDeleteDiaryMutation;
