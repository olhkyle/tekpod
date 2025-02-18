import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import supabase from '../supabase/service';
import { Button, LabelInput, Toast } from '../components';
import { loginSchema, type LoginSchema } from '../components/auth/schema';
import { useLoading } from '../hooks';
import useUserStore from '../store/userStore';
import useToastStore from '../store/useToastStore';
import { routes } from '../constants';
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

const LoginPage = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		register,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const { Loading, isLoading, startTransition } = useLoading();
	const { setUserData } = useUserStore();
	const { addToast } = useToastStore();

	/**
	 * queryClient.setQueryData(['auth'], userData)
		- 즉시 캐시된 데이터를 직접 업데이트
		- 새로운 데이터로 즉각적으로 쿼리의 캐시 상태를 변경
		- 추가 네트워크 요청 없이 클라이언트 상태 즉시 반영
		- 성능이 좋고 즉각적인 UI 업데이트에 적합


		queryClient.invalidateQueries({ queryKey: ['auth'] })
		- 해당 쿼리 캐시를 무효화
		- 다음 요청 시 서버에서 데이터를 다시 가져옴
		- 가장 최신 데이터를 확실히 불러올 때 유용
		- 네트워크 요청을 유발하므로 약간의 오버헤드 발생
	 */
	const onSubmit = async (formData: LoginSchema) => {
		try {
			const { data, error } = await startTransition(supabase.auth.signInWithPassword(formData));

			if (error) {
				addToast(toastData.PROFILE.LOGIN.ERROR);
				throw new Error(error.message);
			}

			if (data) {
				setUserData(data.session);
				queryClient.setQueryData(['auth'], data.session);
				navigate(routes.HOME);
				addToast(toastData.PROFILE.LOGIN.SUCCESS);
			}
		} catch (error) {
			setValue('email', formData.email);
			setValue('password', '');
			console.error(error);
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

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--black);
	background-color: var(--greyOpacity100);
	border-radius: var(--radius-s);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

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

const ResetPasswordButton = styled(Button)`
	padding: calc(var(--padding-container-mobile) / 4);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--grey900);
	background-color: var(--grey100);
	border: 1px solid var(--grey200);
	border-radius: var(--radius-xs);

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
