const monetizeWithWon = (value: string) => value.replace(/,/gi, '').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

export { monetizeWithWon };
