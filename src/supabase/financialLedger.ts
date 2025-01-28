import { FinancialLedger } from './schema';
import supabase from './service';

/**
 *
 * user_id: string;
 * place: boolean;
 * price: string;
 * payment_method: string;
 * bank: string;
 * usage_date: Date;
 * created_at: Date;
 * updated_at: Date;
 */

const TABLE = 'financial_ledger';

const calculatePriceUnits = (data: FinancialLedger[]) => {
	const groupByUnit = data.reduce((acc, item) => {
		const { price_unit, priceIntegerPart, priceDecimalPart } = item;

		if (!acc[price_unit]) {
			acc[price_unit] = [];
		}

		acc[price_unit].push(Number(`${priceIntegerPart}.${priceDecimalPart}`));
		return acc;
	}, {} as Record<string, number[]>);

	const priceUnits = Object.entries(groupByUnit).reduce((acc, [unit, prices]) => {
		acc[unit] = prices.length === 1 ? prices[0] : prices.reduce((sum, price) => sum + Number(price), 0);
		return acc;
	}, {} as Record<string, number>);

	return priceUnits;
};

const getPaymentsByDate = async (date: Date): Promise<{ data: FinancialLedger[]; totalPrice: number | Record<string, number> }> => {
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

	return { data, totalPrice: data.length ? calculatePriceUnits(data) : 0 };
};

const addPayment = async (data: Omit<FinancialLedger, 'id'>) => {
	const { error: addPaymentError } = await supabase.from(TABLE).insert(data).select();

	if (addPaymentError) {
		throw { error: addPaymentError, message: 'Error to add payment' };
	}
};

const removePayment = async ({ id }: { id: string }) => {
	await supabase.from(TABLE).delete().eq('id', id);
};

export { getPaymentsByDate, addPayment, removePayment };
