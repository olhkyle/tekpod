import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeRecipe, RestrictedRecipe } from '../../supabase';
import { toastData, queryKey } from '../../constants';
import { useToastStore } from '../../store';

interface UseRemoveFilmRecipeMutation {
	id: string;
	handlers: {
		onClose: () => void;
		onTopLevelModalClose: () => void;
	};
}

const remove =
	({ id }: { id: string }) =>
	(oldData: RestrictedRecipe[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useRemoveRecipeMutation = ({ id, handlers }: UseRemoveFilmRecipeMutation) => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();
	const { onClose, onTopLevelModalClose } = handlers;

	const QUERY_KEY = [...queryKey.FILM_RECIPE, id];

	const { mutate, isPending } = useMutation({
		async mutationFn(variables: { id: string; path: string }) {
			await removeRecipe(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData(QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(QUERY_KEY, remove(variables));
			}

			return { previousData };
		},

		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				addToast(toastData.FILM_RECIPE.REMOVE.ERROR);

				queryClient.setQueryData(QUERY_KEY, context?.previousData);
			}
		},

		onSuccess: () => {
			addToast(toastData.FILM_RECIPE.REMOVE.SUCCESS);
			onClose();
		},

		onSettled() {
			onTopLevelModalClose();
			return queryClient.invalidateQueries({ queryKey: queryKey.FILM_RECIPE });
		},
	});

	return { mutate, isPending };
};

export default useRemoveRecipeMutation;
