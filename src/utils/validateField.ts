const validateTitle = (title: string) => {
	if (!title.trim()) {
		return 'Title is required';
	}
};

export { validateTitle };
