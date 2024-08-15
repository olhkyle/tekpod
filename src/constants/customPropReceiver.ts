const customPropReceiver = {
	shouldForwardProp: (propName: string) => !propName.startsWith('$'),
};

export default customPropReceiver;
