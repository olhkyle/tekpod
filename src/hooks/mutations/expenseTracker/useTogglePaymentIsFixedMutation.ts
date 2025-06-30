import { useMutation } from '@tanstack/react-query';
import { ExpenseTracker, PaymentsByDate, togglePaymentIsFixed } from '../../../supabase';
import { useToastStore } from '../../../store';
import { toastData, queryKey } from '../../../constants';
import { formatByKoreanTime } from '../../../utils';
import { useClientSession } from '../../../hooks';

interface UseTogglePaymentIsFixedMutation {
	currentDate: Date;
	handlers: { [key: string]: () => void };
}

type Variables = Pick<ExpenseTracker, 'id' | 'isFixed' | 'updated_at'>;

const toggle =
	({ id, isFixed, updated_at }: Variables) =>
	(oldData: PaymentsByDate) => {
		return { ...oldData, expense: oldData.expense.map(item => (item.id === id ? { ...item, isFixed, updated_at } : item)) };
	};

const useTogglePaymentIsFixedMutation = ({ currentDate, handlers: { goBack } }: UseTogglePaymentIsFixedMutation) => {
	const { queryClient } = useClientSession();
	const { addToast } = useToastStore();
	const QUERY_KEY = [...queryKey.EXPENSE_TRACKER, formatByKoreanTime(currentDate)];

	return useMutation({
		async mutationFn(variables: Variables) {
			await togglePaymentIsFixed(variables);
		},
		async onMutate(variables) {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData(QUERY_KEY);

			if (previousData) {
				queryClient.setQueryData(QUERY_KEY, toggle(variables));
			}

			return { previousData };
		},

		onSuccess() {
			addToast(toastData.EXPENSE_TRACKER.TOGGLE.SUCCESS);
			goBack();
		},

		onError(error, _, context) {
			if (context?.previousData) {
				console.error(error);
				queryClient.setQueryData(QUERY_KEY, context?.previousData);
				addToast(toastData.EXPENSE_TRACKER.TOGGLE.ERROR);
			}
		},
		onSettled() {
			return queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
};

export default useTogglePaymentIsFixedMutation;
