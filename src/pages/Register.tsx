import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema } from '../components/auth/schema';
import { Button, LabelInput } from '../components';
import { Link } from 'react-router-dom';
import { routes } from '../constants';
import { useFunnel } from '../hooks';
import { useEffect } from 'react';

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

const RegisterPage = () => {
	const {
		register,
		watch,
		formState: { errors, isValid },
		trigger,
		setFocus,
	} = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
	});

	const { step, isLastStepDone, push, back, isStepValidated } = useFunnel<RegisterSchema>({
		id: 'register-form-funnel',
		initial: { step: 'email' },
		steps: {
			email: {
				step: 'email',
				isDone: !errors['email'] && !!watch('email')?.trim() && isValid,
				next: 'password',
			},
			password: {
				step: 'password',
				isDone: !errors['password'] && !!watch('password')?.trim() && isValid,
				next: 'nickname',
			},
			nickname: {
				step: 'nickname',
				isDone: !errors['nickname'] && !!watch('nickname')?.trim() && isValid,
				next: 'done',
			},
		},
	});

	useEffect(() => {
		setFocus('email');
	}, []);

	return (
		<div css={pageCss.container}>
			<form css={pageCss.form}>
				<Title>
					<Link to={routes.HOME}>TEKT</Link>
				</Title>
				<Description>Create your account</Description>
				{step === 'email' && (
					<LabelInput label={'email'} errorMessage={errors?.email?.message}>
						<LabelInput.TextField type={'email'} id={'email'} {...register('email')} placeholder={'Email'} />
					</LabelInput>
				)}
				{step === 'password' && (
					<LabelInput label={'password'} errorMessage={errors?.password?.message}>
						<LabelInput.TextField type={'password'} id={'password'} {...register('password')} placeholder={'Password'} />
					</LabelInput>
				)}
				{step === 'nickname' && (
					<LabelInput label={'nickname'} errorMessage={errors?.nickname?.message}>
						<LabelInput.TextField type={'text'} id={'nickname'} {...register('nickname')} placeholder={'Nickname'} />
					</LabelInput>
				)}
				{!isLastStepDone && (
					<ContinueButton
						type="button"
						onClick={async () => {
							const isStepValid = await trigger(step);

							if (isStepValid && isStepValidated(step)) {
								push();
							}
						}}>
						Continue
					</ContinueButton>
				)}
				{isLastStepDone && (
					<SubmitButton type="submit" disabled={!(!errors['nickname'] && !!watch('nickname')?.trim() && isValid)}>
						Submit
					</SubmitButton>
				)}
				{!isLastStepDone && step !== 'email' && (
					<GoBackButton type="button" onClick={back}>
						Go Back
					</GoBackButton>
				)}
			</form>
		</div>
	);
};

const Title = styled.h2`
	min-width: 270px;
	font-size: var(--fz-h6);
	font-weight: var(--fw-black);
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
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-s);
`;

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	background-color: var(--black);
	color: var(--white);
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-s);

	&:disabled {
		background-color: var(--grey300);
	}
`;

const GoBackButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--black);
	font-weight: var(--fw-semibold);
	border: 1px solid var(--greyOpacity50);
	border-radius: var(--radius-s);

	&:hover,
	&:focus {
		background-color: var(--greyOpacity100);
	}
`;

export default RegisterPage;
