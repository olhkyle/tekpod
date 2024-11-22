import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeRecipe } from '../../supabase/filmRecipe';
import { RestrictedRecipe } from '../../supabase/schema';

const remove =
	({ id }: { id: string }) =>
	(oldData: RestrictedRecipe[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useRemoveRecipeMutation = (id: string) => {
	const queryClient = useQueryClient();
	const queryKey = ['film_recipes', id];

	const { mutate, isPending } = useMutation({
		async mutationFn(variables: { id: string; path: string }) {
			await removeRecipe(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey });

			const previousData = queryClient.getQueryData(queryKey);

			if (previousData) {
				queryClient.setQueryData(queryKey, remove(variables));
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

export default useRemoveRecipeMutation;
