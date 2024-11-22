import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRecipe } from '../../supabase/filmRecipe';
import { RestrictedRecipe } from '../../supabase/schema';

const add =
	({ data }: { data: Omit<RestrictedRecipe, 'id' | 'imgSrc'> }) =>
	(oldData: RestrictedRecipe[]) => {
		return [...oldData, data];
	};

const useAddFilmRecipeMutation = () => {
	const queryClient = useQueryClient();
	const queryKey = ['film_recipes'];

	const { mutate, isPending } = useMutation({
		async mutationFn(variables: { data: Omit<RestrictedRecipe, 'id' | 'imgSrc'>; imageFile: File }) {
			await addRecipe(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey });

			const previousData = queryClient.getQueryData(queryKey);

			if (previousData) {
				queryClient.setQueryData(queryKey, add(variables));
			}

			return { previousData };
		},

		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(queryKey, context?.previousData);
			}
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey });
		},
	});

	return { mutate, isPending };
};

export default useAddFilmRecipeMutation;
