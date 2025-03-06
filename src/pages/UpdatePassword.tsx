import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLogo, Button, LabelInput } from '../components';
import { useEffect } from 'react';
import supabase from '../supabase/service';
import { useLoading } from '../hooks';
import { useForm } from 'react-hook-form';
import { updatePasswordSchema, UpdatePasswordSchema } from '../components/auth/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import useToastStore from '../store/useToastStore';
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
		height: 100dvh;
		background-color: var(--white);
	`,
};

const UpdatePassword = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();

	const { register, handleSubmit } = useForm<UpdatePasswordSchema>({ resolver: zodResolver(updatePasswordSchema) });

	useEffect(() => {
		searchParams.set('email', searchParams.get('email')!);
		setSearchParams(searchParams);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (formData: UpdatePasswordSchema) => {
		//TODO: supabase.auth.updateUser

		try {
			const { error } = await startTransition(
				supabase.auth.updateUser({
					password: formData.password,
				}),
			);

			if (error) {
				throw new Error(error.message);
			}

			addToast(toastData.PROFILE.RESET_PASSWORD.SUCCESS);
			navigate(routes.LOGIN);
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.RESET_PASSWORD.ERROR);
		}
	};

	// TODO: searchParams.get('email') === null -> submit 후에 문제 있으면 setSearchParams를 통해 email 을 활용해 searchParam 재지정
	return (
		<div css={pageCss.container}>
			<form css={pageCss.form} onSubmit={handleSubmit(onSubmit)}>
				<AuthLogo />
				<Title>﹡ Update Password ﹡</Title>

				<EmailInfo>{searchParams.get('email')}</EmailInfo>
				<LabelInput label="Password">
					<LabelInput.TextField type="password" {...register('password')} placeholder="Password" />
				</LabelInput>
				<LabelInput label="Confirm Password">
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
