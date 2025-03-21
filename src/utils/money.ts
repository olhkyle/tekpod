const monetizeWithSeparator = (value: string | number) => {
	const _value = typeof value === 'number' ? value + '' : value;
	return _value.replace(/,/gi, '').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export { monetizeWithSeparator };
