import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema } from '../components/auth/schema';
import { Button, LabelInput } from '../components';
import { Link } from 'react-router-dom';
import { routes } from '../constants';
import { useFunnel } from '../hooks';

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
		formState: { errors },
	} = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		mode: 'onChange',
	});

	const { step, isLastStepDone } = useFunnel<RegisterSchema>({
		id: 'register-form-funnel',
		initial: { step: 'email' },
		steps: {
			email: {
				step: 'email',
				isDone: !errors['email'] && !!watch('email')?.trim(),
				next: 'password',
			},
			password: {
				step: 'password',
				isDone: !errors['password'] && !!watch('password')?.trim(),
				next: 'nickname',
			},
			nickname: {
				step: 'nickname',
				isDone: !errors['nickname'] && !!watch('nickname')?.trim(),
				next: 'done',
			},
		},
	});

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
				{!isLastStepDone && <NextButton type="button">Next</NextButton>}
				{isLastStepDone && <button type="submit">Submit</button>}
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

const NextButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	background-color: var(--black);
	color: var(--white);
	border-radius: var(--radius-s);
`;

export default RegisterPage;
