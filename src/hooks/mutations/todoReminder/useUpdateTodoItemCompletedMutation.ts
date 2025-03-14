import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, updatedTodoCompleted } from '../../../supabase';
import { queryKey, toastData } from '../../../constants';
import { useToastStore } from '../../../store';

interface Variables {
	id: string;
	completed: boolean;
	updated_at: Date;
}

const update =
	({ id, completed, updated_at }: Variables) =>
	(oldData: Todo[]) => {
		return oldData.map(item => (item.id === id ? { ...item, completed, updated_at } : item));
	};

const useUpdateTodoItemCompletedMutation = () => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		async mutationFn(variables: Variables) {
			await updatedTodoCompleted(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: queryKey.TODOS });
			const previousData = queryClient.getQueryData(queryKey.TODOS);

			if (previousData) {
				queryClient.setQueryData(queryKey.TODOS, update(variables));
			}

			return { previousData };
		},
		async onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);

				addToast(toastData.TODO_REMINDER.EDIT.ERROR);
				queryClient.setQueryData(queryKey.TODOS, context?.previousData);
			}
		},
		onSuccess() {
			addToast(toastData.TODO_REMINDER.EDIT.SUCCESS);
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		},
	});
};

export default useUpdateTodoItemCompletedMutation;
