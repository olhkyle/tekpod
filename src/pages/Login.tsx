import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import supabase from '../supabase/service';
import { LabelInput } from '../components';
import { loginSchema, type LoginSchema } from '../components/auth/schema';
import useUserStore from '../store/userStore';
import useLoading from '../hooks/useLoading';
import { routes } from '../constants';

const LoginPage = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const { Loading, isLoading, startTransition } = useLoading();

	const { setUserData } = useUserStore();
	const navigate = useNavigate();

	const onSubmit = async (formData: LoginSchema) => {
		try {
			const { data, error } = await startTransition(supabase.auth.signInWithPassword(formData));

			if (error) {
				throw new Error(error.message);
			}

			setUserData(data.session);
			navigate(routes.HOME);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Title>﹡﹡</Title>
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
		</Form>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 16px;
	height: calc(100dvh - 2.5 * var(--nav-height));
`;

const Title = styled.h2`
	min-width: 270px;
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

const SubmitButton = styled.button`
	padding: var(--padding-container-mobile);
	min-width: 270px;
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
