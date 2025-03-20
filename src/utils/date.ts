import { format, toZonedTime } from 'date-fns-tz';
const today = new Date();
const todayLocaleString = today.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });

const currentKoreanTimeWithLocaleString = new Date(todayLocaleString);

const [currentYear, currentMonth, currentDate] = [today.getFullYear(), today.getMonth(), today.getDate()];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const formatByKoreanTime = (targetDate: Date | string): string => {
	const _date = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;

	const koreaTimeZone = 'Asia/Seoul';
	const koreaDate = toZonedTime(_date, koreaTimeZone);

	const formattedDate = format(koreaDate, 'yyyy/MM/dd', { timeZone: koreaTimeZone });

	return formattedDate;
};

const translateNumberIntoMonth = (month: number) => months[month]; // ['Jan', 'Feb', 'Mar'][number]

const getDateFromString = (dateString: string): Date => {
	return new Date(dateString);
};

const getNormalizedDateString = (date: Date) => {
	return date.toISOString().split('T')[0];
};

const getNextMonthFormatDate = (usageDate: Date) => {
	const _date = new Date(usageDate);
	const [month, date] = [_date.getMonth(), _date.getDate()];

	return `${(month + 2 + '').padStart(2, '0')}.${(date + '').padStart(2, '0')}`;
};

export {
	today,
	todayLocaleString,
	currentKoreanTimeWithLocaleString,
	currentYear,
	currentMonth,
	currentDate,
	months,
	formatByKoreanTime,
	translateNumberIntoMonth,
	getDateFromString,
	getNormalizedDateString,
	getNextMonthFormatDate,
};
