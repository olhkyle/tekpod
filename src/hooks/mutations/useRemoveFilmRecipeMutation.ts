import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeRecipe } from '../../supabase/filmRecipe';
import { RestrictedRecipe } from '../../supabase/schema';
import queryKey from '../../constants/queryKey';

const remove =
	({ id }: { id: string }) =>
	(oldData: RestrictedRecipe[]) => {
		return oldData.filter(item => item.id !== id);
	};

const useRemoveRecipeMutation = (id: string) => {
	const queryClient = useQueryClient();

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
				queryClient.setQueryData(QUERY_KEY, context?.previousData);
			}
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: queryKey.FILM_RECIPE });
		},
	});

	return { mutate, isPending };
};

export default useRemoveRecipeMutation;
