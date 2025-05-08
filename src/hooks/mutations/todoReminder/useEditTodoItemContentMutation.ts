import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editTodoContent, type Todo } from '../../../supabase';
import { queryKey, toastData } from '../../../constants';
import { useToastStore } from '../../../store';
import { OldData } from '../../../types';

type Variables = Pick<Todo, 'id' | 'content' | 'updated_at'>;

const edit =
	({ id, content, updated_at }: Variables) =>
	(oldData: OldData<Todo>) => {
		return { ...oldData, pages: oldData.pages.map(page => page.map(todo => (todo.id === id ? { ...todo, content, updated_at } : todo))) };
	};

const useEditTodoItemContentMutation = (handler: () => void) => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();
	const QUERY_KEY = queryKey.TODOS_BY_PAGE;

	return useMutation({
		async mutationFn(variables: Variables) {
			await editTodoContent(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });
			const previousData = queryClient.getQueryData(QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(QUERY_KEY, edit(variables));
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
		onSuccess() {
			addToast(toastData.TODO_REMINDER.EDIT.SUCCESS);
			handler();
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
};

export default useEditTodoItemContentMutation;
