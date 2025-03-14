import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRecipe, RestrictedRecipe } from '../../../supabase';
import { useToastStore } from '../../../store';
import { toastData, queryKey } from '../../../constants';

interface UseAddFilmRecipeMutation {
	handlers: {
		onClose: () => void;
	};
}

const add =
	({ data }: { data: Omit<RestrictedRecipe, 'id' | 'imgSrc'> }) =>
	(oldData: RestrictedRecipe[]) => {
		return [...oldData, data];
	};

const useAddFilmRecipeMutation = ({ handlers: { onClose } }: UseAddFilmRecipeMutation) => {
	const queryClient = useQueryClient();
	const { addToast } = useToastStore();

	const { mutate, isPending } = useMutation({
		async mutationFn(variables: { data: Omit<RestrictedRecipe, 'id' | 'imgSrc'>; imageFile: File }) {
			await addRecipe(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: queryKey.FILM_RECIPE });

			const previousData = queryClient.getQueryData(queryKey.FILM_RECIPE);

			if (previousData) {
				queryClient.setQueryData(queryKey.FILM_RECIPE, add(variables));
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
				queryClient.setQueryData(queryKey.FILM_RECIPE, context?.previousData);
				addToast(toastData.FILM_RECIPE.CREATE.SUBMIT.ERROR);
			}
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.FILM_RECIPE });
		},
	});

	return { mutate, isPending };
};

export default useAddFilmRecipeMutation;
