const monetizeWithSeparator = (value: string | number) => {
	const _value = typeof value === 'number' ? value + '' : value;
	const result = _value.replace(/,/gi, '').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

	return result.includes('.') ? result.slice(0, result.indexOf('.') + 3) : result;
};

export { monetizeWithSeparator };
