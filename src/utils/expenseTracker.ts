import { ExpenseTracker } from '../supabase';
import { currentMonth, months } from './date';

interface GetCompletedMonth {
	payment: ExpenseTracker;
	usage_month: number;
	usage_date: number;
	FIXED_PAYMENT_DATE: number;
}

const getCompletedMonth = ({ payment: { installment_plan_months }, usage_month, usage_date, FIXED_PAYMENT_DATE }: GetCompletedMonth) => {
	const isInstallmentNotNull = installment_plan_months !== null;
	const isBeforeFixedDate = usage_date <= FIXED_PAYMENT_DATE;

	if (!isInstallmentNotNull) return null;

	if (usage_month < currentMonth) {
		if (installment_plan_months === 0) {
			return isBeforeFixedDate ? null : months[usage_month + 1];
		}

		if (installment_plan_months > 0) {
			return isBeforeFixedDate ? months[usage_month + installment_plan_months - 1] : months[usage_month + installment_plan_months];
		}
	}

	if (usage_month === currentMonth) {
		if (installment_plan_months === 0) {
			return isBeforeFixedDate ? months[usage_month] : months[usage_month + 1];
		}

		if (installment_plan_months > 0) {
			return isBeforeFixedDate ? months[usage_month + installment_plan_months] : months[usage_month + installment_plan_months + 1];
		}
	}

	return null;
};

export { getCompletedMonth };
