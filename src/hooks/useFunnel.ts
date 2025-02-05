/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

interface UseFunnelTrigger<T> {
	id: string;
	initial: { step: keyof T };
	steps?: { [K in keyof T]: { step: K; isDone: boolean; next?: keyof T | 'done' } };
}

const useFunnel = <T>(trigger: UseFunnelTrigger<T>) => {
	const [initialized, setInitialized] = useState(false);
	const [history, setHistory] = useState<(keyof T)[]>([]);
	const [currentStep, setCurrentStep] = useState(trigger.initial.step);

	useEffect(() => {
		if (!initialized) {
			setInitialized(true);
			return;
		}

		if (trigger.steps?.[currentStep].isDone) {
			const nextStep = trigger.steps?.[currentStep].next;

			if (nextStep !== 'done' && nextStep) {
				setHistory([...history, currentStep]);
				setCurrentStep(nextStep);
			}
		}
	}, [trigger.steps, initialized, currentStep]);

	return { step: currentStep, isLastStepDone: trigger.steps?.[currentStep].next === 'done', history };
};

export default useFunnel;
