/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';

interface UseFunnelTrigger<T> {
	id: string;
	initial: { step: keyof T };
	steps?: { [K in keyof T]: { step: K; isValidated: boolean; next?: keyof T | 'done' } };
}

const useFunnel = <T>(trigger: UseFunnelTrigger<T>) => {
	const [history, setHistory] = useState<(keyof T)[]>([]); // ['email']
	const [currentStep, setCurrentStep] = useState(trigger.initial.step); // 'email' | 'password' | 'nickname'

	const isStepValidated = (step: keyof T) => {
		return trigger.steps?.[step]?.isValidated ?? false;
	};

	const push = () => {
		const step = trigger.steps?.[currentStep]; // { step : 'email' , isValidated: false, next: 'password' }

		if (step?.isValidated && step.next && step.next !== 'done') {
			setHistory([...history, currentStep]);
			setCurrentStep(step.next);
		}
	};

	const back = () => {
		if (history.length) {
			const previousStep = history[history.length - 1];
			setHistory(history.slice(0, -1));
			setCurrentStep(previousStep);
			return previousStep;
		}

		return null;
	};

	return {
		step: currentStep,
		isLastStep: trigger.steps?.[currentStep].next === 'done',
		isStepValidated,
		history,
		historyActions: { push, back },
	};
};

export default useFunnel;
