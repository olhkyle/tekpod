import { useEffect } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLogo, Button, LabelInput } from '../components';
import supabase from '../supabase/service';
import { useLoading } from '../hooks';
import { updatePasswordSchema, UpdatePasswordSchema } from '../components/auth/schema';
import useToastStore from '../store/useToastStore';
import useUserStore from '../store/userStore';
import { toastData } from '../constants/toast';
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
		height: calc(100dvh - var(--nav-height) * 4);
		background-color: var(--white);
	`,
};

/**
 * <Layout/> 바깥에서 해당 페이지를 그릴 경우, 이메일에서 redirectUrl이 담긴 {{ .ConfirmationUrl }} 클릭 시 해당 URL에는 {{ .Token }}이 담겨있지만,
 * supabase.auth.updateUser 사용 시 'Auth : session is missing'이라는 에러를 반환하게 된다.
 *
 * 따라서, <Layout/> 컴포넌트 내부에 그리도록 하여, <AuthentiationGuard/> 내부의 useAuthQuery()를 통해 url로부터 session(token)을 확보하고, supabase.auth.updateUser 사용 시 session이 있다고 supabase로부터 confirm을 받고 비밀번호를 업데이트 할 수 있게 된다.
 */
const UpdatePassword = () => {
	const queryClient = useQueryClient();

	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { state } = useLocation();

	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();
	const { resetUser } = useUserStore();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<UpdatePasswordSchema>({ resolver: zodResolver(updatePasswordSchema) });

	useEffect(() => {
		supabase.auth.onAuthStateChange(async event => {
			if (event === 'SIGNED_IN') {
				searchParams.set('email', searchParams.get('email')!);
				setSearchParams(searchParams);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (formData: UpdatePasswordSchema) => {
		try {
			const { error: updateUserError } = await startTransition(
				supabase.auth.updateUser({
					password: formData.password,
				}),
			);

			if (updateUserError) {
				throw new Error(updateUserError.message);
			}

			const { error: signOutError } = await startTransition(supabase.auth.signOut({ scope: 'local' }));

			if (signOutError) {
				throw new Error(signOutError?.message);
			}

			resetUser();
			addToast(toastData.PROFILE.UPDATE_PASSWORD.SUCCESS);
			navigate(routes.LOGIN, { replace: true });
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.UPDATE_PASSWORD.ERROR);
		} finally {
			queryClient.setQueryData(['auth'], null);
			queryClient.clear();
		}
	};

	return (
		<div css={pageCss.container}>
			<form css={pageCss.form} onSubmit={handleSubmit(onSubmit)}>
				<AuthLogo />
				<Title>﹡ Update Password ﹡</Title>

				<EmailInfo>{searchParams.get('email') || state?.email}</EmailInfo>
				<LabelInput label="Password" errorMessage={errors['password']?.message}>
					<LabelInput.TextField type="password" {...register('password')} placeholder="Password" />
				</LabelInput>
				<LabelInput label="Confirm Password" errorMessage={errors['confirmPassword']?.message}>
					<LabelInput.TextField type="password" {...register('confirmPassword')} placeholder="Password Confirm" />
				</LabelInput>
				<SubmitButton type="submit" aria-label="Update Password Button">
					{isLoading ? Loading : 'Submit'}
				</SubmitButton>
			</form>
		</div>
	);
};

const Title = styled.h4`
	padding: calc(var(--padding-container-mobile) * 0.5);
	min-width: 270px;
	color: var(--blue200);
	background-color: var(--blue100);
	font-size: var(--fz-h6);
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-s);
	text-align: center;
`;

const EmailInfo = styled.div`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);
	color: var(--grey700);
	background-color: var(--greyOpacity100);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
`;

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--white);
	background-color: var(--blue200);
	border-radius: var(--radius-s);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

export default UpdatePassword;
