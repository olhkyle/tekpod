type PaymentDataType = (typeof paymentData)[keyof typeof paymentData][number];
type PaymentMethodType = (typeof paymentData)['paymentMethod'][number];

type PriceUnitType = (typeof priceUnit)['unitType'][number];
type PriceUnitSymbolType = (typeof priceUnit)['unitSymbol'][number];

type MatchedPriceUnitWithSymbol = Record<(typeof priceUnit.unitType)[number], (typeof priceUnit.unitSymbol)[number]>;

const paymentData = {
	paymentMethod: ['Card', 'Cash'] as const,
	banks: ['신한', '하나', '국민', '우리', 'IBK기업', '농협', '카카오뱅크', '토스뱅크', '새마을', 'SC제일', '씨티', '해당없음'] as const,
	priceUnits: ['WON', 'USD', 'GBP', 'EUR', 'JPY'],
} as const;

const priceUnit = {
	unitType: ['WON', 'USD', 'GBP', 'EUR', 'JPY'] as const,
	unitSymbol: ['₩', '$', '£', '€', '¥'] as const,
} as const;

const bankSvgs: Record<string, `/public/bank/${string}.svg`> = {
	신한: '/public/bank/shinhan.svg',
	하나: '/public/bank/hana.svg',
	국민: '/public/bank/kookmin.svg',
	우리: '/public/bank/woori.svg',
	IBK기업: '/public/bank/ibk.svg',
	농협: '/public/bank/nonghyeop.svg',
	카카오뱅크: '/public/bank/kakaobank.svg',
	토스뱅크: '/public/bank/tossbank.svg',
	새마을: '/public/bank/saemaeul.svg',
	SC제일: '/public/bank/sc.svg',
	씨티: '/public/bank/citi.svg',
};

const matchedPriceUnitWithSymbol = priceUnit.unitType.reduce((acc, curr, idx) => {
	acc[curr] = priceUnit.unitSymbol[idx];

	return acc;
}, {} as MatchedPriceUnitWithSymbol);

export type { PaymentDataType, PaymentMethodType, PriceUnitType, PriceUnitSymbolType, MatchedPriceUnitWithSymbol };
export { paymentData, priceUnit, bankSvgs, matchedPriceUnitWithSymbol };
