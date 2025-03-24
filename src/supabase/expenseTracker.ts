import supabase from './service';
import { ExpenseTracker } from './schema';
import { currentYear } from '../utils';

const TABLE = 'expense_tracker';

const ZERO_PRICE = 0;

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
export { getPaymentsByDate, getAllPaymentsByMonth, getFixedCostPaymentsByMonth, addPayment, togglePaymentIsFixed, removePayment };
