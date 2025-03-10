const today = new Date();
const todayLocaleString = today.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });

const currentKoreanTime = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

const [currentYear, currentMonth, currentDate] = [today.getFullYear(), today.getMonth(), today.getDate()];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const format = (targetDate: Date): string => {
	const _date = new Date(targetDate);
	const [year, month, date] = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate()];

	return `${year + ''}.${(month + '').padStart(2, '0')}.${(date + '').padStart(2, '0')}`;
};

const translateNumberIntoMonth = (month: number) => months[month]; // ['Jan', 'Feb', 'Mar'][number]

const getDateFromString = (dateString: string): Date => {
	return new Date(dateString);
};

const getNextMonthFormatDate = (usageDate: Date) => {
	const _date = new Date(usageDate);
	const [month, date] = [_date.getMonth(), _date.getDate()];

	return `${(month + 2 + '').padStart(2, '0')}.${(date + '').padStart(2, '0')}`;
};

export {
	today,
	todayLocaleString,
	currentKoreanTime,
	currentYear,
	currentMonth,
	currentDate,
	months,
	format,
	translateNumberIntoMonth,
	getDateFromString,
	getNextMonthFormatDate,
};
