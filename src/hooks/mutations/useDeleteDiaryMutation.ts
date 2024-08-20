import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeDiary } from '../../supabase/diary';
import { Diary } from '../../supabase/schema';

const remove =
	({ id }: { id: string }) =>
	(oldData: Diary[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useDeleteDiaryMutation = () => {
	const queryClient = useQueryClient();
	const queryKey = ['diary'];

	const { mutate, isPending } = useMutation({
		mutationFn: async (variables: { id: string }) => {
			await removeDiary(variables);
		},
		async onMutate(variables) {
			// Cancel any outgoing refetch
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey });
			const previousData = queryClient.getQueryData(queryKey);

			if (previousData) {
				queryClient.setQueryData(queryKey, remove(variables));
			}

			return { previousData };
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(queryKey, context?.previousData);
			}
		},
		// Always refetch after error or success:
		onSettled() {
			return queryClient.invalidateQueries({ queryKey });
		},
	});
	return { mutate, isPending };
};

export default useDeleteDiaryMutation;
