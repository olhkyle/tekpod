type PaymentDataType = (typeof paymentData)[keyof typeof paymentData][number];

const paymentData = {
	paymentMethod: ['card', 'cash'] as const,
	banks: ['신한', '하나', '국민', '우리', 'IBK기업', '농협', '카카오뱅크', '토스뱅크', '새마을', 'SC제일', '씨티'] as const,
} as const;

export type { PaymentDataType };
export { paymentData };
