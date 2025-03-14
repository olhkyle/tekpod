import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { removeDiary } from '../../supabase/diary';
import { Diary } from '../../supabase/schema';
import { useToastStore } from '../../store';
import queryKey from '../../constants/queryKey';
import { routes } from '../../constants';
import { toastData } from '../../constants/toast';

const remove =
	({ id }: { id: string }) =>
	(oldData: Diary[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useDeleteDiaryMutation = () => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();
	const navigate = useNavigate();

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

				addToast(toastData.DIARY.REMOVE.ERROR);
				queryClient.setQueryData(queryKey.DIARY, context?.previousData);
			}
		},
		onSuccess() {
			addToast(toastData.DIARY.REMOVE.SUCCESS);
			navigate(routes.DIARY);
		},
		// Always refetch after error or success:
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: [...queryKey.DIARY, ...queryKey.DIARY_BY_PAGE] });
		},
	});
	return { mutate, isPending };
};

export default useDeleteDiaryMutation;
