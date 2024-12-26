import { z } from 'zod';
import { paymentData } from '../../../constants/financialLedger';

type AddPaymentFormSchema = z.infer<typeof addPaymentFormSchema>;

// z.enum() 대신 z.union()과 z.literal() 사용
const paymentMethodSchema = z.union([
	z.literal(paymentData.paymentMethod[0]), // '카드'
	z.literal(paymentData.paymentMethod[1]), // '현금'
]);

const bankSchema = z.enum(paymentData.banks);

const priceUnitSchema = z.enum(paymentData.priceUnits);

const addPaymentFormSchema = z
	.object({
		place: z
			.string({ required_error: 'The Place where you spend money is in need' })
			.min(1, { message: 'Write the place where you spend money ' }),
		usage_date: z
			.date({
				required_error: 'Select Date in essential',
				invalid_type_error: 'Select the correct Date',
			})
			.refine(date => date <= new Date(), "Can't choose the future date"),
		payment_method: paymentMethodSchema,
		bank: bankSchema.default('해당없음'),
		price: z.string().min(1, 'Please write the Price'),
		price_unit: priceUnitSchema,
	})
	.refine(
		data => {
			// 카드 결제인 경우 은행 선택 필수
			if (data.payment_method === 'Cash') {
				return true;
			}
			return data.bank !== '해당없음';
		},
		{
			message: 'Bank is required for card payments',
			path: ['bank'],
		},
	);

export type { AddPaymentFormSchema };
export { addPaymentFormSchema };
