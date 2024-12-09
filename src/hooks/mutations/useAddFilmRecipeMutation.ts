import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRecipe } from '../../supabase/filmRecipe';
import { RestrictedRecipe } from '../../supabase/schema';
import queryKey from '../../constants/queryKey';

const add =
	({ data }: { data: Omit<RestrictedRecipe, 'id' | 'imgSrc'> }) =>
	(oldData: RestrictedRecipe[]) => {
		return [...oldData, data];
	};

const useAddFilmRecipeMutation = () => {
	const queryClient = useQueryClient();

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

		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(queryKey.FILM_RECIPE, context?.previousData);
			}
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.FILM_RECIPE });
		},
	});

	return { mutate, isPending };
};

export default useAddFilmRecipeMutation;
