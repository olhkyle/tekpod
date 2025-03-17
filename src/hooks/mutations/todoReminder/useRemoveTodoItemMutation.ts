import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '../../../store';
import { removeTodo, Todo } from '../../../supabase';
import { queryKey, toastData } from '../../../constants';

interface Variables {
	id: string;
}

const remove =
	({ id }: Variables) =>
	(oldData: Todo[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useRemoveTodoItemMutation = (handler?: () => void) => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		async mutationFn(variables: Variables) {
			await removeTodo(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: queryKey.TODOS });
			const previousData = queryClient.getQueryData(queryKey.TODOS);

			if (previousData) {
				queryClient.setQueryData(queryKey.TODOS, remove(variables));
			}

			return { previousData };
		},
		async onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);

				addToast(toastData.TODO_REMINDER.REMOVE.ERROR);
				queryClient.setQueryData(queryKey.TODOS, context?.previousData);
			}
		},
		onSuccess() {
			addToast(toastData.TODO_REMINDER.REMOVE.SUCCESS);
			handler?.();
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		},
	});
};

export default useRemoveTodoItemMutation;
