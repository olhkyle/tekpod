type PaymentDataType = (typeof paymentData)[keyof typeof paymentData][number];

type PriceUnitType = (typeof priceUnit)['unitType'][number];
type PriceUnitSymbolType = (typeof priceUnit)['unitSymbol'][number];

const paymentData = {
	paymentMethod: ['Card', 'Cash'] as const,
	banks: ['신한', '하나', '국민', '우리', 'IBK기업', '농협', '카카오뱅크', '토스뱅크', '새마을', 'SC제일', '씨티', '해당없음'] as const,
	priceUnits: ['WON', 'USD', 'GBP', 'EUR', 'JPY'],
} as const;

const priceUnit = {
	unitType: ['WON', 'USD', 'GBP', 'EUR', 'JPY'] as const,
	unitSymbol: ['₩', '$', '£', '€', '¥'] as const,
} as const;

export type { PaymentDataType, PriceUnitType, PriceUnitSymbolType };
export { paymentData, priceUnit };
