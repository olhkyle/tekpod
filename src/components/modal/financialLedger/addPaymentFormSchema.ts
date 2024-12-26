import { z } from 'zod';
import { paymentData } from '../../../constants/financialLedger';

type AddPaymentFormSchema = z.infer<typeof addPaymentFormSchema>;

// z.enum() 대신 z.union()과 z.literal() 사용
const paymentMethodSchema = z.union([
	z.literal(paymentData.paymentMethod[0]), // '카드'
	z.literal(paymentData.paymentMethod[1]), // '현금'
]);

const bankSchema = z.enum(paymentData.banks);

const addPaymentFormSchema = z
	.object({
		place: z
			.string({ required_error: 'The Place where you spend money is in need' })
			.min(1, { message: 'Write the place where you spend money ' }),
		selectedDate: z
			.date({
				required_error: 'Select Date in essential',
				invalid_type_error: 'Select the correct Date',
			})
			.refine(date => date <= new Date(), '미래 날짜는 선택할 수 없습니다.'),
		payment_method: paymentMethodSchema,
		bank: bankSchema.optional(),
		price: z.number().min(1, '금액을 입력해주세요'),
	})
	.refine(
		data => {
			// 카드 결제인 경우 은행 선택 필수
			if (data.payment_method === 'card') {
				return !!data.bank;
			}
			return true;
		},
		{
			message: 'Please select bank, if you pay with Card',
			path: ['bank'],
		},
	);

export type { AddPaymentFormSchema };
export { addPaymentFormSchema };
