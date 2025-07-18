import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { removeDiary, Diary } from '../../../supabase';
import { useToastStore } from '../../../store';
import { toastData, routes, queryKey } from '../../../constants';
import { OldData } from '../../../types';
import { useClientSession } from '../../../hooks';

type Variables = Pick<Diary, 'id'>;

const remove =
	({ id }: Variables) =>
	(oldData: OldData<Diary>) => {
		return { ...oldData, pages: oldData.pages.map(page => page.filter(diary => diary.id !== id)) };
	};

const useRemoveDiaryMutation = () => {
	const { queryClient } = useClientSession();
	const navigate = useNavigate();
	const { addToast } = useToastStore();
	const DIARY_QUERY_KEY = queryKey.DIARY_BY_PAGE;

	return useMutation({
		async mutationFn(variables: Variables) {
			await removeDiary(variables);
		},
		async onMutate(variables) {
			// Cancel any outgoing refetch
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: DIARY_QUERY_KEY });
			const previousData = queryClient.getQueryData(DIARY_QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(DIARY_QUERY_KEY, remove(variables));
			}

			return { previousData };
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);

				addToast(toastData.DIARY.REMOVE.ERROR);
				queryClient.setQueryData(DIARY_QUERY_KEY, context?.previousData);
			}
		},
		onSuccess() {
			addToast(toastData.DIARY.REMOVE.SUCCESS);
			navigate(routes.DIARY);
		},
		// Always refetch after error or success:
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: [...DIARY_QUERY_KEY, ...queryKey.DIARY_BY_PAGE] });
		},
	});
};

export default useRemoveDiaryMutation;
