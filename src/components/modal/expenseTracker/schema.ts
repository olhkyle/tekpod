import { z } from 'zod';
import { cardType, installmentPlanMonths, InstallmentType, paymentData } from '../../../constants';
import { today } from '../../../utils';

type AddPaymentFormSchema = z.infer<typeof addPaymentFormSchema>;

const paymentMethodSchema = z.enum(paymentData.paymentMethod, {
	errorMap: () => {
		return { message: 'Please select a valid payment method ' };
	},
});

const cardTypeSchema = z.enum(Object.values(cardType) as [string, ...string[]], {
	errorMap: () => {
		return { message: 'Please select a valid card type' };
	},
});

const installment = z
	.number()
	.refine((val): val is InstallmentType => installmentPlanMonths.includes(val as InstallmentType), {
		message: 'Invalid installment plan',
	})
	.nullable();

const bankSchema = z.enum(paymentData.banks, {
	errorMap: () => {
		return { message: 'Please select the bank ' };
	},
});

const priceUnitSchema = z.enum(paymentData.priceUnits, {
	errorMap: () => {
		return { message: 'Please select the price unit ' };
	},
});

const addPaymentFormSchema = z.object({
	place: z
		.string({ required_error: 'The Place where you spend money is in need' })
		.min(1, { message: 'Write the place where you spend money ' }),
	usage_date: z
		.date({
			required_error: 'Select Date in essential',
			invalid_type_error: 'Select the correct Date',
		})
		.refine(date => date <= today, "Can't choose the future date"),
	payment_method: paymentMethodSchema,
	card_type: cardTypeSchema,
	installment_plan_months: installment,
	bank: bankSchema,
	price_unit: priceUnitSchema,
	price: z
		.string({ required_error: 'Please write the price' })
		.regex(/^\d+(\.\d{0,2})?$/, 'Write correct price(max 2 decimal points)')
		.transform(val => parseFloat(val))
		.refine(val => !isNaN(val) && val >= 0, 'Price should be over 0'),
});

export type { AddPaymentFormSchema };
export { addPaymentFormSchema };
