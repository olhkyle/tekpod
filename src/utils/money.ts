const monetizeWithSeparator = (value: string) => value.replace(/,/gi, '').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

export { monetizeWithSeparator };
