import supabase from './service';
import { ExpenseTracker } from './schema';
import { currentMonth, currentYear, formatByKoreanTime } from '../utils';
import { cardType } from '../constants';

const TABLE = import.meta.env.VITE_SUPABASE_DB_TABLE_EXPENSE_TRACKER;

const ZERO_PRICE = 0;

const FIXED_PAYMENT_DATE = 8;

const getStartDayOfMonth = (month: number) => new Date(currentYear, month, 1).toISOString();

const getEndDayOfMonth = (month: number) => new Date(currentYear, month + 1, 0).toISOString();

const calculatePriceUnits = (data: ExpenseTracker[]) => {
	const groupByUnit = data.reduce<Record<string, number[]>>((acc, item) => {
		const { price_unit, priceIntegerPart, priceDecimalPart } = item;

		if (!acc[price_unit]) {
			acc[price_unit] = [];
		}

		acc[price_unit].push(Number(`${priceIntegerPart}.${priceDecimalPart}`));
		return acc;
	}, {});

	const priceUnits = Object.entries(groupByUnit).reduce<Record<string, number>>((acc, [unit, prices]) => {
		acc[unit] = prices.length === 1 ? prices[0] : prices.reduce((sum, price) => sum + Number(price), ZERO_PRICE);
		return acc;
	}, {});

	return priceUnits;
};

/**
 * @description
 * Example 1
 * > 2월 21일 결제 -> 2개월 할부
 *
 * > 2월 8일 전에 결제 시 -> 2월 결제 예정 => 2 ~ 3월 동안 21일에 결제
 *
 * > 2월 8일 이후 결제 시 -> 3월 결제 예정 => 3 ~ 4월 동안 21일에 결제
 *
 * Example 2
 * > 2월 21일 결제 -> 1개월 할부(일시불)
 *
 * > 2월 8일 전에 결제 시 -> 2월 결제 예정 => 2월 21일에 결제
 *
 * > 2월 8일 이후 결제 시 -> 3월 결제 예정 => 3월 21일에 결제
 *
 * 1. `month > new Date(usage_date).getMonth()`
 * > e.g. - if. month = 2(March) | new Date(usage_date).getMonth() = 1(February)
 *
 * 			1-1-1. 일시불이고 8일보다 전에 결제한 경우 (installment_plan_months === 0 && newDate(usage_date).getDate() <= FIXED_PAYMENT_DATE) | e.g 2월 7일에 결제 (현재는 3월) => 2월 21일 결제 예정이므로 보여줄 필요 없음
 * 					- not shown (return false | completedMonth : null)
 *
 * 			1-1-2.일시불이고 8일보다 이후에 결제한 경우 (installment_plan_months === 0 && newDate(usage_date).getDate() > FIXED_PAYMENT_DATE)
 * 					- shown (return true | completedMonth : months[installment_plan_months + new Date(usage_date).getMonth() + 1])
 *
 * 			1-2-1. 일시불이 아니고, 8일보다 전에 결제한 경우 (installment_plan_months > 0 && newDate(usage_date).getDate() <= FIXED_PAYMENT_DATE)
 * 					- shown (return true | completedMonth : months[installment_plan_months + new Date(usage_date).getMonth() - 1])
 *
 * 			1-2-2. 일시불이 아니고, 8일보다 이후 결제한 경우 (installment_plan_months > 0 && newDate(usage_date).getDate() > FIXED_PAYMENT_DATE)  e.g. 2월 21일 결제 (현재는 3월) =>  3 - 4월 (2개월 할부)
 * 					- shown (return true | completedMonth : installment_plan_months + new Date(usage_date).getMonth())
 *
 * >
 *
 * 2. `month === newDate(usage_date).getMonth()`
 * > e.g. - if. month = 2(March) | new Date(usage_date).getMonth() = 2(March)
 *
 * 			2-1-1. 일시불이고 8일보다 전에 결제한 경우(installment_plan_months === 0 && newDate(usage_date).getDate() <= FIXED_PAYMENT_DATE)
 * 					- shown (return true | completedMonth : months[new Date(usage_date).getMonth()])
 *
 * 			2-1-2. 일시불이고 8일보다 이후에 결제한 경우(installment_plan_months === 0 && newDate(usage_date).getDate() > FIXED_PAYMENT_DATE)
 * 					- shown (return true | completedMonth : months[new Date(usage_date).getMonth() + 1])
 *
 * 			2-2-1. 일시불이 아니고, 8일보다 전에 결제한 경우 (installment_plan_months > 0 && newDate(usage_date).getDate() <= FIXED_PAYMENT_DATE) | e.g. 3월 7일 결제 (현재는 3월) => 3월 21일 결제 완료 (1개월 할부)
 * 					- shown (return true | completedMonth : months[installment_plan_months + new Date(usage_date).getMonth()])
 *
 * 			2-2-2. 일시불이 아니고, 8일보다 이후에 결제한 경우 |(installment_plan_months > 0 && newDate(usage_date).getDate() > FIXED_PAYMENT_DATE) | e.g 3월 21일 결제 (현재는 3월) =>  4 - 5월 (2개월 할부)
 * 					- shown (return true | completedMonth : months[installment_plan_months + new Date(usage_date).getMonth() + 1])
 */

const getCreditCardTransactionData = (data: ExpenseTracker[]) =>
	data?.filter(item => {
		const _date = new Date(formatByKoreanTime(item.usage_date));
		const [usage_month, usage_date] = [_date.getMonth(), _date.getDate()];

		if (usage_month < currentMonth) {
			if (item.installment_plan_months === 0) {
				return usage_date > FIXED_PAYMENT_DATE;
			}

			return true;
		}

		if (usage_month === currentMonth) {
			if (item.installment_plan_months === 0) {
				return usage_date > FIXED_PAYMENT_DATE;
			}

			return true;
		}

		return false;
	});

type PaymentsByDate = { expense: ExpenseTracker[]; totalPrice: number | Record<string, number> };

const getPaymentsByDate = async (date: Date): Promise<PaymentsByDate> => {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const { data, error } = await supabase
		.from(TABLE)
		.select('*')
		.gte('usage_date', startOfDay.toISOString())
		.lte('usage_date', endOfDay.toISOString());

	if (error) {
		throw new Error(error.message);
	}

	return { expense: data, totalPrice: data.length ? calculatePriceUnits(data) : ZERO_PRICE };
};

const getAllPaymentsByMonth = async (month: number) => {
	const { data, error } = await supabase
		.from(TABLE)
		.select('*')
		.gte('usage_date', getStartDayOfMonth(month))
		.lte('usage_date', getEndDayOfMonth(month));

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const getAllPaymentsPriceByMonth = async (month: number) => {
	const data = await getAllPaymentsByMonth(month);

	return Object.values(calculatePriceUnits(data)).length === 0 ? { price: 0 } : calculatePriceUnits(data);
};

const getFixedCostPaymentsByMonth = async (month: number) => {
	const { data, error } = await supabase
		.from(TABLE)
		.select('*')
		.eq('isFixed', true)
		.gte('usage_date', getStartDayOfMonth(month))
		.lte('usage_date', getEndDayOfMonth(month))
		.order('usage_date', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const getCreditCardPaymentsByMonth = async () => {
	const { data, error } = await supabase
		.from(TABLE)
		.select('*')
		.eq('card_type', cardType['신용'])
		.order('usage_date', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return getCreditCardTransactionData(data);
};

const addPayment = async (data: Omit<ExpenseTracker, 'id' | 'isFixed'>) => {
	const { error: addPaymentError } = await supabase.from(TABLE).insert(data).select();

	if (addPaymentError) {
		throw { error: addPaymentError, message: 'Error to add payment' };
	}
};

const togglePaymentIsFixed = async ({ id, isFixed }: { id: string; isFixed: boolean }) => {
	const { error } = await supabase.from(TABLE).update({ isFixed }).eq('id', id);

	if (error) {
		throw new Error(error.message);
	}
};

const removePayment = async ({ id }: { id: string }) => {
	await supabase.from(TABLE).delete().eq('id', id);
};

export type { PaymentsByDate };
export {
	FIXED_PAYMENT_DATE,
	getPaymentsByDate,
	getAllPaymentsByMonth,
	getAllPaymentsPriceByMonth,
	getFixedCostPaymentsByMonth,
	getCreditCardPaymentsByMonth,
	addPayment,
	togglePaymentIsFixed,
	removePayment,
};
