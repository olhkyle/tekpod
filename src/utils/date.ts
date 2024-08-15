const today = new Date();

const format = (targetDate: Date) => {
	const _date = new Date(targetDate);
	const [year, month, date] = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate()];

	return `${(month + '').padStart(2, '0')}.${(date + '').padStart(2, '0')}.${year + ''}`;
};

export { today, format };
