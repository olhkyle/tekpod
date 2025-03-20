import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '../../../store';
import { removeTodo, Todo } from '../../../supabase';
import { queryKey, toastData } from '../../../constants';

type Variables = Pick<Todo, 'id'>;

const remove =
	({ id }: Variables) =>
	(oldData: Todo[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useRemoveTodoItemMutation = (handler?: () => void) => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();
	const QUERY_KEY = queryKey.TODOS;

	return useMutation({
		async mutationFn(variables: Variables) {
			await removeTodo(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });
			const previousData = queryClient.getQueryData(QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(QUERY_KEY, remove(variables));
			}

			return { previousData };
		},
		async onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);

				addToast(toastData.TODO_REMINDER.REMOVE.ERROR);
				queryClient.setQueryData(QUERY_KEY, context?.previousData);
			}
		},
		onSuccess() {
			addToast(toastData.TODO_REMINDER.REMOVE.SUCCESS);
			handler?.();
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
};

export default useRemoveTodoItemMutation;
