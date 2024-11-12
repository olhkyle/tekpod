import { useEffect } from 'react';
import useToastStore from '../store/useToastStore';

const useToastUnsubscribe = () => {
	const { removeToast } = useToastStore();

	useEffect(() => {
		const unsubscribeToastStore = useToastStore.subscribe(({ toast }) => {
			if ((toast && toast?.status === 'success') || toast?.status === 'warn' || toast?.status === 'info' || toast?.status === 'error') {
				const timer = setTimeout(() => {
					removeToast();
				}, 3000);
				return () => {
					clearTimeout(timer);
				};
			}
		});

		return () => {
			unsubscribeToastStore();
		};
	}, [removeToast]);
};

export default useToastUnsubscribe;
