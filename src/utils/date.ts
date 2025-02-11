const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDate = today.getDate();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const format = (targetDate: Date) => {
	const _date = new Date(targetDate);
	const [year, month, date] = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate()];

	return `${year + ''}.${(month + '').padStart(2, '0')}.${(date + '').padStart(2, '0')}`;
};

const translateNumberIntoMonth = (month: number) => months[month];

export { today, currentYear, currentMonth, currentDate, months, format, translateNumberIntoMonth };
