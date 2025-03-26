import shinhanSvg from '../assets/bank/shinhan.svg';
import hanaSvg from '../assets/bank/hana.svg';
import kookminSvg from '../assets/bank/kookmin.svg';
import wooriSvg from '../assets/bank/woori.svg';
import ibkSvg from '../assets/bank/ibk.svg';
import nonghyeopSvg from '../assets/bank/nonghyeop.svg';
import kakaoBankSvg from '../assets/bank/kakaobank.svg';
import tossBankSvg from '../assets/bank/tossbank.svg';
import saemaeulSvg from '../assets/bank/saemaeul.svg';
import scSvg from '../assets/bank/sc.svg';
import citiSvg from '../assets/bank/citi.svg';

type PaymentDataType = (typeof paymentData)[keyof typeof paymentData][number];
type PaymentMethodType = (typeof paymentData)['paymentMethod'][number];

type InstallmentType = (typeof installmentPlanMonths)[number];

type PriceUnitType = (typeof priceUnit)['unitType'][number];
type PriceUnitSymbolType = (typeof priceUnit)['unitSymbol'][number];

type MatchedPriceUnitWithSymbol = Record<(typeof priceUnit.unitType)[number], (typeof priceUnit.unitSymbol)[number]>;

const paymentData = {
	paymentMethod: ['Card', 'Cash'] as const,
	banks: ['신한', '하나', '국민', '우리', 'IBK기업', '농협', '카카오뱅크', '토스뱅크', '새마을', 'SC제일', '씨티', '해당없음'] as const,
	priceUnits: ['WON', 'USD', 'GBP', 'EUR', 'JPY'],
} as const;

const installmentPlanMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36] as const;

const cardType = {
	신용: 'Credit',
	체크: 'Debit',
	미확인: 'Unconfirmed',
} as const;

const priceUnit = {
	unitType: ['WON', 'USD', 'GBP', 'EUR', 'JPY'] as const,
	unitSymbol: ['₩', '$', '£', '€', '¥'] as const,
} as const;

const bankSvgs: Record<string, string> = {
	신한: shinhanSvg,
	하나: hanaSvg,
	국민: kookminSvg,
	우리: wooriSvg,
	IBK기업: ibkSvg,
	농협: nonghyeopSvg,
	카카오뱅크: kakaoBankSvg,
	토스뱅크: tossBankSvg,
	새마을: saemaeulSvg,
	SC제일: scSvg,
	씨티: citiSvg,
};

const matchedPriceUnitWithSymbol = priceUnit.unitType.reduce((acc, curr, idx) => {
	acc[curr] = priceUnit.unitSymbol[idx];

	return acc;
}, {} as MatchedPriceUnitWithSymbol);

export type { PaymentDataType, PaymentMethodType, InstallmentType, PriceUnitType, PriceUnitSymbolType, MatchedPriceUnitWithSymbol };
export { paymentData, installmentPlanMonths, cardType, priceUnit, bankSvgs, matchedPriceUnitWithSymbol };
