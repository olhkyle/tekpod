import { useEffect } from 'react';

interface UseTriggerEscape {
	condition: boolean;
	trigger: () => void;
}

const useTriggerEscape = ({ condition, trigger }: UseTriggerEscape) => {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (condition) {
					trigger();
				}
			}
		};

		window.addEventListener('keydown', handler);

		return () => window.removeEventListener('keydown', handler);
	}, [condition, trigger]);
};

export default useTriggerEscape;
