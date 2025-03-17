import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editTodoContent, Todo } from '../../../supabase';
import { queryKey, toastData } from '../../../constants';
import { useToastStore } from '../../../store';

interface Variables {
	id: string;
	content: string;
	updated_at: Date;
}

const edit =
	({ id, content, updated_at }: Variables) =>
	(oldData: Todo[]) => {
		return oldData.map(item => (item.id === id ? { ...item, content, updated_at } : item));
	};

const useEditTodoItemContentMutation = (handler: () => void) => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	return useMutation({
		async mutationFn(variables: Variables) {
			await editTodoContent(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: queryKey.TODOS });
			const previousData = queryClient.getQueryData(queryKey.TODOS);

			if (previousData) {
				queryClient.setQueryData(queryKey.TODOS, edit(variables));
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
			handler();
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		},
	});
};

export default useEditTodoItemContentMutation;
