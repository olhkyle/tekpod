import { format, toZonedTime } from 'date-fns-tz';

const koreaTimeZone = 'Asia/Seoul';

const today = new Date();
const todayLocaleString = today.toLocaleString('en-US', { timeZone: koreaTimeZone });

const [currentYear, currentMonth, currentDate] = [today.getFullYear(), today.getMonth(), today.getDate()];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const formatByKoreanTime = (targetDate: Date | string): string => {
	const _date = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;

	const formattedDate = format(toZonedTime(_date, koreaTimeZone), 'yyyy/MM/dd', { timeZone: koreaTimeZone });

	return formattedDate;
};

const translateNumberIntoMonth = (month: number) => months[month]; // ['Jan', 'Feb', 'Mar'][number]

const getDateFromString = (dateString: string): Date => {
	return new Date(dateString);
};

const getNextMonthFormatDate = (usageDate: Date | string) => {
	const _date = typeof usageDate === 'string' ? new Date(usageDate) : usageDate;
	const koreaDate = toZonedTime(_date, koreaTimeZone);
	const [month, date] = [koreaDate.getMonth(), koreaDate.getDate()];

	return `${((month + 2 > 12 ? month + 2 - 12 : month + 2) + '').padStart(2, '0')}/${(date + '').padStart(2, '0')}`;
};

export {
	today,
	todayLocaleString,
	currentYear,
	currentMonth,
	currentDate,
	months,
	formatByKoreanTime,
	translateNumberIntoMonth,
	getDateFromString,
	getNextMonthFormatDate,
};
