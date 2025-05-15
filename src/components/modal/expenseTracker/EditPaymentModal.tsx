import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editPaymentFormSchema, EditPaymentFormSchema, ModalDataType, ModalLayout } from '..';
import { Button, LabelInput } from '../..';
import { editPaymentPlace, ExpenseTracker, ServiceDataType } from '../../../supabase';
import { useLoading } from '../../../hooks';
import { useToastStore } from '../../../store';
import { queryKey, routes, toastData } from '../../../constants';
import { formatByKoreanTime } from '../../../utils';

interface EditPaymentModalProps {
	id: string;
	type: ModalDataType;
	data: ServiceDataType<ExpenseTracker, { transaction_date: Date }>;
	onClose: () => void;
}

const EditPaymentModal = ({ id, type, data, onClose }: EditPaymentModalProps) => {
	const queryClient = useQueryClient();
	const {
		register,
		formState: { errors },
		setFocus,
		handleSubmit,
	} = useForm<EditPaymentFormSchema>({
		resolver: zodResolver(editPaymentFormSchema),
		defaultValues: {
			place: data?.place,
		},
	});

	const navigate = useNavigate();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	useEffect(() => {
		setFocus('place');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (formData: EditPaymentFormSchema) => {
		try {
			if (data?.id) {
				await startTransition(editPaymentPlace({ id: data?.id, place: formData?.place }));
			}

			onClose();
			addToast(toastData.EXPENSE_TRACKER.EDIT.SUCCESS);
			navigate(routes.EXPENSE_TRACKER_BY_MONTH, { replace: true });
		} catch (e) {
			console.error(e);
			addToast(toastData.EXPENSE_TRACKER.EDIT.ERROR);
		} finally {
			if (data?.transaction_date) {
				queryClient.invalidateQueries({ queryKey: [...queryKey.EXPENSE_TRACKER, formatByKoreanTime(data?.transaction_date)] });
			}
		}
	};

	return (
		<ModalLayout id={id} type={type} title={`Edit Payment`} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<LabelInput label="nickname" errorMessage={errors['place']?.message}>
					<LabelInput.TextField type="text" id="place" {...register('place')} placeholder="Place" />
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
	margin-top: 16px;
	padding: var(--padding-container-mobile);
	width: 100%;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}

	&:disabled {
		background-color: var(--greyOpacity400);
	}
`;

export default EditPaymentModal;
