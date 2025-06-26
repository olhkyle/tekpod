import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '../components';
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
	const { addToast } = useToastStore();

	useEffect(() => {
		if (isCountdownRunning && countdownTime > 0) {
			countdownIntervalRef.current = setInterval(() => {
				setCountdownTime(prevTime => {
					if (prevTime <= 1) {
						setIsCountdownRunning(false);
						addToast(toastData.POMODORO_TIMER.CUSTOM('info', `${formatCountdownTime(countdownTime)} 완료`));
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

	const setCountdownTimer = () => {
		setCountdownTime(inputMinutes * SIXTY);
	};

	return (
		<Container>
			<MinuteAndSecondDisplay isAlmostDone={countdownTime <= 30}>{formatCountdownTime(countdownTime)}</MinuteAndSecondDisplay>
			<SetInputAndButton>
				<input
					type="text"
					min="1"
					max="60"
					value={inputMinutes}
					onChange={e => setInputMinutes(Number(e.target.value))}
					disabled={isCountdownRunning}
				/>
				<SetButton type="button" onClick={setCountdownTimer} disabled={isCountdownRunning}>
					Set
				</SetButton>
			</SetInputAndButton>
			<ButtonGroup>
				<StartButton type="button" onClick={startCountdown} disabled={isCountdownRunning || countdownTime === 0}>
					Start
				</StartButton>
				<PauseButton type="button" onClick={pauseCountdown} disabled={!isCountdownRunning}>
					Pause
				</PauseButton>
				{!isCountdownRunning && (
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
	height: calc(100dvh - 2 * var(--nav-height) - 2 * var(--padding-container-mobile));
`;

const MinuteAndSecondDisplay = styled.div<{ isAlmostDone: boolean }>`
	font-size: calc(var(--fz-h1) * 2);
	font-weight: var(--fw-black);

	color: ${({ isAlmostDone }) => (isAlmostDone ? 'var(--blue300)' : 'var(--black)')};
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

	input {
		padding: var(--padding-container-mobile);
		width: 60px;
		border: 1px solid var(--grey100);
		border-radius: var(--radius-s);
		text-align: center;
	}
`;

const StyledButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 100px;
	font-weight: var(--fw-semibold);
`;

const SetButton = styled(StyledButton)`
	color: var(--white);
	background-color: var(--grey900);
	border-radius: var(--radius-xl);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey800);
	}
`;

const StartButton = styled(StyledButton)`
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
	color: var(--black);
	border: 1px solid var(--grey200);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey100);
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
