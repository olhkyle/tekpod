import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRecipe, RestrictedRecipe } from '../../../supabase';
import { useToastStore } from '../../../store';
import { toastData, queryKey } from '../../../constants';
import { Handlers } from '../../../types';

interface UseAddFilmRecipeMutation {
	handlers: Handlers;
}

type Variables = { data: Omit<RestrictedRecipe, 'id' | 'imgSrc'>; imageFile: File };

const add =
	({ data }: Variables) =>
	(oldData: RestrictedRecipe[]) => {
		return [...oldData, data];
	};

const useAddFilmRecipeMutation = ({ handlers: { onClose } }: UseAddFilmRecipeMutation) => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();
	const QUERY_KEY = queryKey.FILM_RECIPE;

	return useMutation({
		async mutationFn(variables: Variables) {
			await addRecipe(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData(QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(QUERY_KEY, add(variables));
			}

			return { previousData };
		},

		onSuccess() {
			addToast(toastData.FILM_RECIPE.CREATE.SUBMIT.SUCCESS);
			onClose();
		},

		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(QUERY_KEY, context?.previousData);
				addToast(toastData.FILM_RECIPE.CREATE.SUBMIT.ERROR);
			}
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
};

export default useAddFilmRecipeMutation;
