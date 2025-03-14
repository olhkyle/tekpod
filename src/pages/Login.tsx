import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError } from '@supabase/supabase-js';
import { Button, LabelInput, AuthLogo, loginSchema, type LoginSchema, MODAL_CONFIG, AuthLayout } from '../components';
import { supabase } from '../supabase';
import { useLoading } from '../hooks';
import { useUserStore, useToastStore, useModalStore } from '../store';
import { routes, toastData } from '../constants';

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

	const { startTransition, Loading, isLoading } = useLoading();
	const { setUserData } = useUserStore();
	const { addToast } = useToastStore();
	const { setModal } = useModalStore();

	const handleResetPasswordModal = () => {
		setModal({
			Component: MODAL_CONFIG.USER.RESET_PASSWORD.Component,
			props: {
				type: MODAL_CONFIG.USER.RESET_PASSWORD.type,
				data: null,
			},
		});
	};

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

			// check error including the status that user confirmed email on personal email
			if (error) {
				throw new Error(error.message);
			}

			if (data) {
				setUserData(data.session);
				queryClient.setQueryData(['auth'], data.session);
				addToast(toastData.PROFILE.LOGIN.SUCCESS);
				navigate(routes.HOME, { replace: true });
			}
		} catch (e) {
			console.error((e as AuthError).message);
			setValue('email', formData.email);
			setValue('password', '');
			addToast(toastData.PROFILE.LOGIN.ERROR);
		}
	};

	return (
		<AuthLayout>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<AuthLogo />
				<LabelInput label={'email'} errorMessage={errors?.email?.message}>
					<LabelInput.TextField type={'email'} id={'email'} {...register('email')} placeholder={'Email'} />
				</LabelInput>
				<LabelInput label={'password'} errorMessage={errors?.password?.message}>
					<LabelInput.TextField type={'password'} id={'password'} {...register('password')} placeholder={'Password'} />
				</LabelInput>

				<SubmitButton type="submit" aria-label="Login Button">
					{isLoading ? Loading : 'Login'}
				</SubmitButton>
				<ActionButtons>
					<ResetPasswordButton type="button" onClick={handleResetPasswordModal} aria-label="Reset Password Button">
						Reset Password
					</ResetPasswordButton>
					<RegisterLink to={routes.REGISTER}>SignUp</RegisterLink>
				</ActionButtons>
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

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--white);
	background-color: var(--black);
	border-radius: var(--radius-s);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:hover {
		background-color: var(--grey900);
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
	color: var(--grey700);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-xs);

	&:hover {
		background-color: var(--grey50);
	}
`;

const RegisterLink = styled(Link)`
	padding: calc(var(--padding-container-mobile) / 4);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--grey800);
	background-color: var(--grey200);
	border: 1px solid var(--grey200);
	border-radius: var(--radius-xs);
	transition: background 0.15s ease-in-out;

	&:hover {
		background-color: var(--grey100);
	}
`;

export default LoginPage;
