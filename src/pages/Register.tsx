import { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'es-toolkit';
import supabase from '../supabase/service';
import { useToastStore } from '../store';
import { registerSchema, RegisterSchema } from '../components/auth/schema';
import { Button, LabelInput, AuthLogo } from '../components';
import { useFunnel, useLoading } from '../hooks';
import { customPropReceiver, routes, toastData } from '../constants';
import { addNewUser, isUserExist } from '../supabase/user';
import AuthLayout from '../components/layout/AuthLayout';

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
		formState: { errors, isValid },
		trigger,
		setValue,
		setFocus,
		getFieldState,
		handleSubmit,
		reset,
	} = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues,
	});

	const [isEmailValidated, isPasswordValidated, isNicknameValidated] = [
		!errors['email'] && (watch('email') ?? '').trim().length !== 0,
		!errors['password'] && (watch('password') ?? '').trim().length !== 0,
		!errors['nickname'] && (watch('nickname') ?? '').trim().length !== 0,
	];

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
				isValidated: isEmailValidated,
				next: 'password',
			},
			password: {
				step: 'password',
				isValidated: isPasswordValidated,
				next: 'nickname',
			},
			nickname: {
				step: 'nickname',
				isValidated: isNicknameValidated,
				next: 'done',
			},
		},
	});

	const navigate = useNavigate();
	const { startTransition, isLoading, Loading } = useLoading();
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
			const isEmailFieldValidatedOnEmailStep = step === 'email' && isStepValidated(step);

			// check if user exists based on email
			if (isEmailFieldValidatedOnEmailStep) {
				const { data, error } = await startTransition(isUserExist(watch('email')));

				if (error) {
					throw new Error(error.message);
				}

				// if user exist based on email
				if (data) {
					addToast(toastData.PROFILE.REGISTER.WARN);
					setValue('email', '');
					setFocus('email');
					return;
				}
			}

			const isCurrentStepValid = await trigger(step);

			if (isCurrentStepValid && isStepValidated(step)) {
				push();
			}
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.REGISTER.ERROR);
		}
	};

	const onSubmit = async (userData: RegisterSchema) => {
		try {
			const { data, error } = await startTransition(
				supabase.auth.signUp({
					email: userData.email,
					password: userData.password,
					options: {
						data: { nickname: userData.nickname },
					},
				}),
			);

			if (error) {
				throw new Error(error.message);
			}

			if (data) {
				// insert new User on 'users' table
				const { error: insertNewUserError } = await startTransition(addNewUser({ userId: data.user?.id, userData }));

				if (insertNewUserError) {
					throw new Error(insertNewUserError.message);
				}

				addToast(toastData.PROFILE.REGISTER.SUCCESS);
				reset(defaultValues);
				navigate(routes.LOGIN);
			}
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.REGISTER.ERROR);
		}
	};

	return (
		<AuthLayout>
			<Form onSubmit={handleSubmit(onSubmit)}>
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
							{isLoading ? Loading : 'Continue'}
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
					{isLoading ? Loading : 'Submit'}
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
			</Form>
		</AuthLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 16px;
	padding: var(--padding-container-mobile);
	height: 100dvh;
	background-color: var(--white);
`;

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
	font-size: var(--fz-p);
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
	font-size: var(--fz-p);
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
