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

const getPaymentsByDate = async (date: Date): Promise<{ data: FinancialLedger[]; totalPrice: number }> => {
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

	return { data, totalPrice: data.length === 1 ? data[0].price : data.reduce((sum, curr) => sum + Number(curr.price), 0) };
};

const addPayment = async (data: Omit<FinancialLedger, 'id'>) => {
	const { error: addPaymentError } = await supabase.from(TABLE).insert(data).select();

	if (addPaymentError) {
		throw { error: addPaymentError, message: 'Error to add payment' };
	}
};

export { getPaymentsByDate, addPayment };
