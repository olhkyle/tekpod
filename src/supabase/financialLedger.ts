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

const getPaymentsByDate = async (date: Date) => {
	const { data, error } = await supabase.from(TABLE).select('*').filter('usage_date', 'is', date);

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

export { getPaymentsByDate };
