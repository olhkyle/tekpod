import { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema } from '../components/auth/schema';
import { Button, LabelInput, AuthLogo } from '../components';
import { useFunnel } from '../hooks';
import { customPropReceiver, routes } from '../constants';
import { debounce } from 'es-toolkit';
import supabase from '../supabase/service';
import useToastStore from '../store/useToastStore';
import { toastData } from '../constants/toast';

const pageCss = {
	container: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		overflow: hidden;
	`,
	form: css`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 16px;
		padding: var(--padding-container-mobile);
		height: 100dvh;
		background-color: var(--white);
	`,
};

const TRIGGER_DEBOUNCED_DELAY = 200;

const defaultValues = {
	email: '',
	password: '',
	nickname: '',
};

const RegisterPage = () => {
	/**
	 * ReturnValue
	 * - getFieldState(fieldname: string)
	 * 	- isDirty - when user starts to fill field
	 * 	- isTouched - when user click Submit-Button
	 */
	const {
		register,
		watch,
		formState: { errors, isValid, isSubmitSuccessful },
		trigger,
		setFocus,
		getFieldState,
		handleSubmit,
		reset,
	} = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues,
	});

	const {
		step,
		isLastStep,
		isStepValidated,
		historyActions: { push, back },
	} = useFunnel<RegisterSchema>({
		id: 'register-form-funnel',
		initial: { step: 'email' },
		steps: {
			email: {
				step: 'email',
				isDone: !errors['email'] && (watch('email') ?? '').trim().length !== 0,
				next: 'password',
			},
			password: {
				step: 'password',
				isDone: !errors['password'] && (watch('password') ?? '').trim().length !== 0,
				next: 'nickname',
			},
			nickname: {
				step: 'nickname',
				isDone: !errors['nickname'] && (watch('nickname') ?? '').trim().length !== 0,
				next: 'done',
			},
		},
	});

	const navigate = useNavigate();

	const { addToast } = useToastStore();

	useEffect(() => {
		setFocus(step);
	}, [step, setFocus]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedTriggerCheck = useCallback(
		debounce((fieldName: keyof RegisterSchema) => trigger(fieldName), TRIGGER_DEBOUNCED_DELAY),
		[trigger],
	);

	const continueNextStep = async (step: keyof RegisterSchema) => {
		try {
			//TODO: 이미 있는 이메일인지 USERS 테이블에서 검증하기 - 비동기 요청(이메일 단계만)
			const isCurrentStepValid = await trigger(step);

			if (isCurrentStepValid && isStepValidated(step)) {
				push();
			}
		} catch (e) {
			console.error(e);
		}
	};

	const onSubmit = async (userData: RegisterSchema) => {
		try {
			const { data, error } = await supabase.auth.signUp({
				email: userData.email,
				password: userData.password,
				options: {
					data: { nickname: userData.nickname },
				},
			});

			console.log(data);
			console.log(error);

			if (error) {
				// TODO: error 종류에 따라 다르게 핸들링
				// TODO: 이미 있는 이메일일 경우. error로 체킹이 되지 않음 ??
				addToast(toastData.PROFILE.REGISTER.ERROR);
				throw new Error(error.message);
			}

			if (data) {
				// users 테이블에 email, nickname, id (data.user.id) 기반으로 데이터 create하는 추가 비동기 요청

				addToast(toastData.PROFILE.REGISTER.SUCCESS);

				if (isSubmitSuccessful) {
					navigate(routes.LOGIN);
					reset(defaultValues);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div css={pageCss.container}>
			<form css={pageCss.form} onSubmit={handleSubmit(onSubmit)}>
				<AuthLogo />
				<Description>Create your account</Description>

				{step === 'email' && (
					<>
						<LabelInput label={'email'} errorMessage={errors?.['email']?.message}>
							<LabelInput.TextField
								type={'email'}
								id={'email'}
								{...register('email', { onChange: () => debouncedTriggerCheck('email') })}
								placeholder={'Email'}
							/>
						</LabelInput>
						<ContinueButton type="button" disabled={getFieldState('email')?.invalid} onClick={() => continueNextStep(step)}>
							Continue
						</ContinueButton>
					</>
				)}

				{step === 'password' && (
					<>
						<LabelInput label={'password'} errorMessage={errors?.['password']?.message}>
							<LabelInput.TextField
								type={'password'}
								id={'password'}
								{...register('password', { onChange: () => debouncedTriggerCheck('password') })}
								placeholder={'Password'}
							/>
						</LabelInput>
						<ContinueButton type="button" disabled={getFieldState('password')?.invalid} onClick={() => continueNextStep(step)}>
							Continue
						</ContinueButton>
					</>
				)}

				{/* On last step, we don't need to show ContinueButon */}
				{step === 'nickname' && (
					<LabelInput label={'nickname'} errorMessage={errors?.nickname?.message}>
						<LabelInput.TextField
							type={'text'}
							id={'nickname'}
							{...register('nickname', { onChange: () => debouncedTriggerCheck('nickname') })}
							placeholder={'Nickname'}
						/>
					</LabelInput>
				)}

				<SubmitButton
					type="submit"
					$isShown={isLastStep}
					disabled={(watch('nickname') ?? '').trim().length === 0 || !!errors['nickname'] || !isValid}>
					{'Submit'}
				</SubmitButton>

				{step !== 'email' ? (
					<GoBackButton type="button" onClick={back}>
						Go Back
					</GoBackButton>
				) : (
					<LoginCheckContainer>
						<p>Already have an account?</p>
						<Link to={routes.LOGIN}>Login</Link>
					</LoginCheckContainer>
				)}
			</form>
		</div>
	);
};

const Description = styled.div`
	min-width: 270px;
	font-size: var(--fz-h5);
	font-weight: var(--fw-medium);
`;

const ContinueButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	background-color: var(--black);
	color: var(--white);
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-s);

	&:disabled {
		background-color: var(--grey200);
	}
`;

const SubmitButton = styled(Button, customPropReceiver)<{ $isShown: boolean }>`
	display: ${({ $isShown }) => ($isShown ? 'block' : 'none')};
	padding: var(--padding-container-mobile);
	min-width: 270px;
	background-color: var(--black);
	color: var(--white);
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-s);
	transition: display 0.35s ease-out;

	&:hover,
	&:active {
		background-color: var(--grey900);
	}

	&:disabled {
		background-color: var(--grey300);
	}
`;

const GoBackButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--black);
	font-weight: var(--fw-semibold);
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);

	&:hover,
	&:focus {
		background-color: var(--greyOpacity100);
	}
`;

const LoginCheckContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 6px;
	font-size: var(--fz-sm);
	color: var(--grey900);

	a {
		font-weight: var(--fw-semibold);
		text-decoration: underline;
		transition: color 0.15s ease-in-out;

		&:hover {
			color: var(--grey800);
		}
	}
`;

export default RegisterPage;
