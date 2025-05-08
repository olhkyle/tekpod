import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, updatedTodoCompleted } from '../../../supabase';
import { queryKey, toastData } from '../../../constants';
import { useToastStore } from '../../../store';
import { OldData } from '../../../types';

type Variables = Pick<Todo, 'id' | 'completed' | 'updated_at'>;

const update =
	({ id, completed, updated_at }: Variables) =>
	(oldData: OldData<Todo>) => {
		return { ...oldData, pages: oldData.pages.map(page => page.map(todo => (todo.id === id ? { ...todo, completed, updated_at } : todo))) };
	};

const useUpdateTodoItemCompletedMutation = () => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();
	const QUERY_KEY = queryKey.TODOS_BY_PAGE;

	return useMutation({
		async mutationFn(variables: Variables) {
			await updatedTodoCompleted(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });
			const previousData = queryClient.getQueryData(QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(QUERY_KEY, update(variables));
			}

			return { previousData };
		},
		async onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);

				addToast(toastData.TODO_REMINDER.EDIT.ERROR);
				queryClient.setQueryData(QUERY_KEY, context?.previousData);
			}
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
};

export default useUpdateTodoItemCompletedMutation;
