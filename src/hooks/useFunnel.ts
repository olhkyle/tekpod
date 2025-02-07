/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';

interface UseFunnelTrigger<T> {
	id: string;
	initial: { step: keyof T };
	steps?: { [K in keyof T]: { step: K; isDone: boolean; next?: keyof T | 'done' } };
}

const useFunnel = <T>(trigger: UseFunnelTrigger<T>) => {
	const [history, setHistory] = useState<{ step: keyof T; isDone: boolean }[]>([]);
	const [currentStep, setCurrentStep] = useState(trigger.initial.step);

	const push = () => {
		const step = trigger.steps?.[currentStep];

		console.log(step?.isDone, step?.next, step?.next !== 'done');
		if (step?.isDone && step.next && step.next !== 'done') {
			setHistory([...history, { step: currentStep, isDone: step.isDone }]);
			setCurrentStep(step.next);
		}
	};

	const back = () => {
		if (history.length) {
			const previousStep = history[history.length - 1];
			setHistory(history.slice(0, -1));
			setCurrentStep(previousStep.step);
		}
	};

	const isStepValidated = (step: keyof T) => {
		// 현재 단계의 유효성 상태 확인
		const currentStepData = trigger.steps?.[step];
		if (currentStepData) {
			return currentStepData.isDone;
		}

		// 히스토리에서 해당 단계의 유효성 상태 확인
		const historyStep = history.find(h => h.step === step);
		return historyStep ? historyStep.isDone : false;
	};

	return { step: currentStep, isLastStepDone: trigger.steps?.[currentStep].next === 'done', push, back, isStepValidated };
};

export default useFunnel;
