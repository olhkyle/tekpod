import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError } from '@supabase/supabase-js';
import supabase from '../../../supabase/service';
import { LabelInput } from '../../auth';
import { ModalLayout } from '..';
import { ModalDataType } from '../modalType';
import { Button } from '../../common';
import { resetPasswordSchema, ResetPasswordSchema } from './schema';
import { useLoading } from '../../../hooks';
import useToastStore from '../../../store/useToastStore';
import { routes } from '../../../constants';
import { toastData } from '../../../constants/toast';
import { useEffect } from 'react';

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

	const onSubmit = async (data: ResetPasswordSchema) => {
		try {
			const { error } = await startTransition(
				supabase.auth.resetPasswordForEmail(data.email, {
					redirectTo: `${import.meta.env.VITE_APP_URL}/${routes.UPDATE_PASSWORD}?email=${encodeURIComponent(data.email)}`,
				}),
			);

			if (error) {
				throw new Error(error.message);
			}

			addToast(toastData.PROFILE.RESET_PASSWORD.SUCCESS);
			onClose();
			setValue('email', '');
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.RESET_PASSWORD.CUSTOM('error', (e as AuthError).message));
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
	min-height: 57px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:hover {
		background-color: var(--grey900);
	}
`;

export default ResetPasswordForEmailModal;
