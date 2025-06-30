import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Select } from '../components';
import { useToastStore } from '../store';
import { toastData } from '../constants';

const SIXTY = 60;
const ONE_SECOND = 1000;

const PomodoroTimer = () => {
	const initialMinute = 50;
	const [countdownTime, setCountdownTime] = useState(initialMinute * SIXTY); // 60초
	const [isCountdownRunning, setIsCountdownRunning] = useState(false);
	const [inputMinutes, setInputMinutes] = useState(initialMinute);

	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const { addToast } = useToastStore();

	// prevent auto-lock in IOS
	useEffect(() => {
		async function requestWakeLock() {
			try {
				if ('wakeLock' in navigator) {
					wakeLockRef.current = await navigator.wakeLock.request('screen');
				}
			} catch (err) {
				// Wake Lock 요청 실패 (권한 거부 등)
			}
		}
		if (isCountdownRunning) {
			requestWakeLock();
		} else {
			if (wakeLockRef.current) {
				wakeLockRef.current.release();
				wakeLockRef.current = null;
			}
		}
		return () => {
			if (wakeLockRef.current) {
				wakeLockRef.current.release();
				wakeLockRef.current = null;
			}
		};
	}, [isCountdownRunning]);

	useEffect(() => {
		if (isCountdownRunning && countdownTime > 0) {
			countdownIntervalRef.current = setInterval(() => {
				setCountdownTime(prevTime => {
					if (prevTime <= 1) {
						return 0;
					}

					return prevTime - 1;
				});
			}, ONE_SECOND);
		} else {
			clearInterval(countdownIntervalRef.current!);
		}

		return () => clearInterval(countdownIntervalRef.current!);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isCountdownRunning, countdownTime]);

	useEffect(() => {
		if (countdownTime === 0 && isCountdownRunning) {
			setIsCountdownRunning(false);
			addToast(toastData.POMODORO_TIMER.CUSTOM('info', `It's ${formatCountdownTime(countdownTime)}. All Done.`));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countdownTime, isCountdownRunning]);

	const formatCountdownTime = (seconds: number) => {
		const mins = Math.floor(seconds / SIXTY);
		const secs = seconds % SIXTY;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const startCountdown = () => {
		if (countdownTime > 0) {
			setIsCountdownRunning(true);
		}
	};

	const pauseCountdown = () => {
		setIsCountdownRunning(false);
	};

	const resetCountdown = () => {
		setIsCountdownRunning(false);
		setCountdownTime(inputMinutes * SIXTY);
	};

	const setCountdownTimer = (inputMinutes: number) => {
		setCountdownTime(inputMinutes * SIXTY);
	};

	return (
		<Container>
			<MinuteAndSecondDisplay
				isAllTasksDone={
					countdownTime > 30 ? 'ongoing' : countdownTime <= 30 ? 'almost_done' : countdownTime <= 10 ? 'close_to_done' : 'done'
				}>
				{formatCountdownTime(countdownTime)}
			</MinuteAndSecondDisplay>
			<SetInputAndButton>
				<Select
					data={Array.from({ length: 60 }, (_, idx) => `${idx + 1} min`)}
					placeholder={'Select Minute'}
					descriptionLabel={'Minute'}
					currentValue={`${inputMinutes} min`}
					onSelect={option => {
						const _option = option.split('min')[0];
						setInputMinutes(+_option);
						setCountdownTimer(+_option);
					}}
				/>
			</SetInputAndButton>
			<ButtonGroup>
				<StartButton type="button" onClick={startCountdown} disabled={isCountdownRunning || countdownTime === 0}>
					Start
				</StartButton>
				<PauseButton type="button" onClick={pauseCountdown} disabled={!isCountdownRunning}>
					Pause
				</PauseButton>
				{!isCountdownRunning && countdownIntervalRef.current && (
					<ResetButton type="button" onClick={resetCountdown}>
						Reset
					</ResetButton>
				)}
			</ButtonGroup>
		</Container>
	);
};

const Container = styled.section`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: calc(var(--padding-container-mobile) * 4);
	height: calc(100dvh - 2 * var(--nav-height) - 2 * var(--padding-container-mobile));
`;

const MinuteAndSecondDisplay = styled.div<{ isAllTasksDone: 'ongoing' | 'almost_done' | 'close_to_done' | 'done' }>`
	font-size: calc(var(--fz-h1) * 2);
	font-weight: var(--fw-black);

	color: ${({ isAllTasksDone }) =>
		isAllTasksDone === 'ongoing'
			? 'var(--black)'
			: isAllTasksDone === 'almost_done'
			? 'var(--blue200)'
			: isAllTasksDone === 'close_to_done'
			? 'var(--blue400)'
			: 'var(--blue300)'};
`;

const ButtonGroup = styled.div`
	position: absolute;
	bottom: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	gap: 16px;
`;

const SetInputAndButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;

	#select-root {
		width: 100%;

		button[role='combobox'] {
			width: calc(100dvw - 6 * var(--padding-container-mobile));
			height: 64px;
			font-size: var(--fz-h7);
		}
	}
`;

const StyledButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 100px;
	font-weight: var(--fw-semibold);
`;

const StartButton = styled(StyledButton)`
	width: 100%;
	color: var(--white);
	background-color: var(--black);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey900);
	}

	&:disabled {
		color: var(--grey500);
		background-color: var(--grey100);
	}
`;

const PauseButton = styled(StyledButton)`
	width: 100%;
	color: var(--white);
	background-color: var(--black);
	border: 1px solid var(--grey100);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey900);
	}

	&:disabled {
		color: var(--grey500);
		background-color: var(--grey100);
	}
`;

const ResetButton = styled(StyledButton)`
	color: var(--blue200);
	background-color: var(--blue100);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey100);
	}
`;

export default PomodoroTimer;
