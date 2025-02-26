import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { AuthLogo, Button, LabelInput } from '../components';
import { FormEvent } from 'react';

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

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		searchParams.set('email', searchParams.get('email')!);
		setSearchParams(searchParams);
		//TODO: supabase.auth.updateUser
	};

	// TODO: searchParams.get('email') === null -> submit 후에 문제 있으면 setSearchParams를 통해 email 을 활용해 searchParam 재지정
	return (
		<div css={pageCss.container}>
			<form css={pageCss.form} onSubmit={onSubmit}>
				<AuthLogo />
				<Title>﹡ Update Password ﹡</Title>

				<EmailInfo>{searchParams.get('email')}</EmailInfo>
				<LabelInput label="Password">
					<LabelInput.TextField type="password" name="password" placeholder="Password" />
				</LabelInput>
				<LabelInput label="Password Confirm">
					<LabelInput.TextField type="password" name="passwordConfirm" placeholder="Password Confirm" />
				</LabelInput>
				<SubmitButton type="submit" aria-label="Update Password Button">
					Submit
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
