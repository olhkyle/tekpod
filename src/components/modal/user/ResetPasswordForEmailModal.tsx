import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError } from '@supabase/supabase-js';
import supabase from '../../../supabase/service';
import { ModalLayout, ModalDataType, resetPasswordSchema, ResetPasswordSchema } from '..';
import { Button, LabelInput } from '../..';
import { useLoading } from '../../../hooks';
import { isUserExist } from '../../../supabase';
import { useToastStore } from '../../../store';
import { routes, toastData } from '../../../constants';

interface ResetPasswordForEmailModalProps {
	id: string;
	type: ModalDataType;
	onClose: () => void;
}

const ResetPasswordForEmailModal = ({ id, type, onClose }: ResetPasswordForEmailModalProps) => {
	const {
		register,
		formState: { errors },
		setValue,
		setFocus,
		handleSubmit,
	} = useForm<ResetPasswordSchema>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	useEffect(() => {
		setFocus('email');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (formData: ResetPasswordSchema) => {
		try {
			const { data: isUserExistResult, error: isUserExistError } = await startTransition(isUserExist(formData.email));

			if (!isUserExistResult || isUserExistError) {
				throw new Error('This email is never registered');
			}

			const { error: resetPasswordForEmailError } = await startTransition(
				supabase.auth.resetPasswordForEmail(formData.email, {
					redirectTo: `${window.location.origin}/mypage/${routes.UPDATE_PASSWORD}?email=${encodeURIComponent(formData.email)}`,
				}),
			);

			if (resetPasswordForEmailError) {
				throw new Error(resetPasswordForEmailError.message);
			}

			addToast(toastData.PROFILE.RESET_PASSWORD.SUCCESS);
			onClose();
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.RESET_PASSWORD.CUSTOM('error', (e as AuthError).message));
		} finally {
			setValue('email', '');
		}
	};

	return (
		<ModalLayout id={id} type={type} title={'Reset Password'} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<LabelInput label={'email'} errorMessage={errors['email']?.message}>
					<LabelInput.TextField type="email" id="email" {...register('email')} placeholder="Write your email" />
				</LabelInput>
				<SubmitButton type="submit">{isLoading ? Loading : 'Send'}</SubmitButton>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 16px;
	width: 100%;
`;

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:hover {
		background-color: var(--grey900);
	}
`;

export default ResetPasswordForEmailModal;
