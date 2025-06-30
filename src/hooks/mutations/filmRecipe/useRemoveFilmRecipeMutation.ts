import { useMutation } from '@tanstack/react-query';
import { removeRecipe, RestrictedRecipe } from '../../../supabase';
import { toastData, queryKey } from '../../../constants';
import { useToastStore } from '../../../store';
import { Handlers } from '../../../types';
import { useClientSession } from '../../../hooks';

interface UseRemoveFilmRecipeMutation {
	id: string;
	handlers: Handlers;
}

type Variables = Pick<RestrictedRecipe, 'id'> & { path: string };

const remove =
	({ id }: Variables) =>
	(oldData: RestrictedRecipe[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useRemoveRecipeMutation = ({ id, handlers: { onClose, onTopLevelModalClose } }: UseRemoveFilmRecipeMutation) => {
	const { queryClient } = useClientSession();
	const { addToast } = useToastStore();
	const QUERY_KEY = [...queryKey.FILM_RECIPE, id];

	return useMutation({
		async mutationFn(variables: Variables) {
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
};

export default useRemoveRecipeMutation;
