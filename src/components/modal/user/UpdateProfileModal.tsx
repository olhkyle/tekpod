import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button, ModalLayout, LabelInput } from '../..';
import { updateProfileSchema, UpdateProfileSchema, ModalDataType } from '..';
import { useLoading } from '../../../hooks';
import { supabase, User, updateUser } from '../../../supabase';
import { useToastStore } from '../../../store';
import { toastData, routes, queryKey } from '../../../constants';

interface UpdateProfileModalProps {
	id: string;
	type: ModalDataType;
	onClose: () => void;
	data: User;
}

const UpdateProfileModal = ({ id, type, onClose, data }: UpdateProfileModalProps) => {
	const {
		register,
		formState: { errors },
		setValue,
		setFocus,
		handleSubmit,
	} = useForm<UpdateProfileSchema>({
		resolver: zodResolver(updateProfileSchema),
	});

	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();

	useEffect(() => {
		setValue('nickname', data?.nickname);
		setFocus('nickname');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (formData: Pick<User, 'nickname'>) => {
		if (data?.nickname === formData.nickname) {
			return addToast(toastData.PROFILE.UPDATE_PROFILE.CUSTOM('warn', 'Nickname is not changed'));
		}

		try {
			const { data: updateAuthUserResult, error: updateAuthUserResultError } = await startTransition(
				supabase.auth.updateUser({
					data: formData,
				}),
			);

			if (!updateAuthUserResult || updateAuthUserResultError) {
				throw new Error(updateAuthUserResultError?.message);
			}

			const { error: updateUserResultError } = await startTransition(updateUser({ userId: data?.user_id, userData: formData }));

			if (updateUserResultError) {
				throw new Error(updateUserResultError?.message);
			}

			addToast(toastData.PROFILE.UPDATE_PROFILE.SUCCESS);
			onClose();
			navigate(routes.USER);
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.UPDATE_PROFILE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.AUTH });
		}
	};

	return (
		<ModalLayout id={id} type={type} title="Update Profile" onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<LabelInput label="nickname" errorMessage={errors['nickname']?.message}>
					<LabelInput.TextField type="text" id="nickname" {...register('nickname')} placeholder="Nickname" />
				</LabelInput>
				<SubmitButton type="submit">{isLoading ? Loading : 'Update'}</SubmitButton>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 16px;
	margin-top: 16px;

	@media screen and (max-width: 480px) {
		min-height: calc(100dvh * 0.25);
	}
`;

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);

	&:focus {
		background-color: var(--grey900);
	}
`;

export default UpdateProfileModal;
