import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import supabase from '../supabase/service';
import { LabelInput, Toast } from '../components';
import { loginSchema, type LoginSchema } from '../components/auth/schema';
import { useLoading } from '../hooks';
import useUserStore from '../store/userStore';
import useToastStore from '../store/useToastStore';
import { routes } from '../constants';

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

const LoginPage = () => {
	const {
		register,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { setUserData } = useUserStore();

	const { Loading, isLoading, startTransition } = useLoading();

	const { addToast } = useToastStore();

	const onSubmit = async (formData: LoginSchema) => {
		try {
			const { data, error } = await startTransition(supabase.auth.signInWithPassword(formData));

			if (error) {
				addToast({ status: 'error', message: 'Error with Login' });
				throw new Error(error.message);
			}

			if (data) {
				setUserData(data.session);
				navigate(routes.HOME);
				addToast({ status: 'success', message: 'Successfully Login' });
			}
		} catch (error) {
			setValue('email', formData.email);
			setValue('password', '');
			console.error(error);
		} finally {
			queryClient.invalidateQueries({ queryKey: ['auth'] });
		}
	};

	return (
		<>
			<div css={pageCss.container}>
				<form css={pageCss.form} onSubmit={handleSubmit(onSubmit)}>
					<Title>
						<Link to={routes.HOME}>TEKT</Link>
					</Title>
					<LabelInput label={'email'} errorMessage={errors?.email?.message}>
						<LabelInput.TextField type={'email'} id={'email'} {...register('email')} placeholder={'Email'} />
					</LabelInput>
					<LabelInput label={'password'} errorMessage={errors?.password?.message}>
						<LabelInput.TextField type={'password'} id={'password'} {...register('password')} placeholder={'Password'} />
					</LabelInput>

					<SubmitButton type="submit" aria-label="Login Button">
						{isLoading ? Loading : 'LOGIN'}
					</SubmitButton>
					<ActionButtons>
						<ResetPasswordButton type="button" aria-label="Reset Password Button">
							Reset Password
						</ResetPasswordButton>
						<RegisterLink to={routes.REGISTER}>SignUp</RegisterLink>
					</ActionButtons>
				</form>
			</div>
			<Toast />
		</>
	);
};

const Title = styled.h2`
	min-width: 270px;
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

const SubmitButton = styled.button`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--black);
	background-color: var(--greyOpacity100);
	border-radius: var(--radius-s);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	transition: background 0.15s ease-in-out;

	&:hover {
		background-color: var(--greyOpacity200);
	}
`;

const ActionButtons = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 8px;
	width: 270px;
`;

const ResetPasswordButton = styled.button`
	padding: calc(var(--padding-container-mobile) / 4);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--grey900);
	background-color: var(--grey100);
	border: 1px solid var(--grey200);
	border-radius: var(--radius-xs);
	transition: background 0.15s ease-in-out;

	&:hover {
		background-color: var(--grey200);
	}
`;

const RegisterLink = styled(Link)`
	padding: calc(var(--padding-container-mobile) / 4);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--white);
	background-color: var(--black);
	border: 1px solid var(--grey200);
	border-radius: var(--radius-xs);
	transition: background 0.15s ease-in-out;

	&:hover {
		background-color: var(--grey900);
	}
`;

export default LoginPage;
