import { useMutation } from '@tanstack/react-query';
import { useToastStore } from '../../../store';
import { removeTodo, Todo } from '../../../supabase';
import { queryKey, routes, toastData } from '../../../constants';
import { OldData } from '../../../types';
import { useClientSession } from '../../../hooks';
import { useNavigate } from 'react-router-dom';

type Variables = Pick<Todo, 'id'>;

const remove =
	({ id }: Variables) =>
	(oldData: OldData<Todo>) => {
		return { ...oldData, pages: oldData.pages.map(page => page.filter(todo => todo.id !== id)) };
	};

const useRemoveTodoItemMutation = (handler?: () => void) => {
	const { queryClient } = useClientSession();
	const { addToast } = useToastStore();
	const navigate = useNavigate();
	const QUERY_KEY = queryKey.TODOS_BY_PAGE;

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
			navigate(routes.TODO_REMINDER, { replace: true });
		},
		onSettled() {
			handler?.();
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
				queryClient.invalidateQueries({ queryKey: queryKey.ALARM }),
			]);
		},
	});
};

export default useRemoveTodoItemMutation;
