/* eslint-disable no-mixed-spaces-and-tabs */
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalDataType, ModalLayout } from '..';
import { StatusSelect, Button, TextInput } from '../..';
import { recordSchema, RecordSchema } from './schema';
import { addCommute, CommuteRecord, ServiceDataType, updateCommute } from '../../../supabase';
import { useClientSession, useLoading } from '../../../hooks';
import { useToastStore } from '../../../store';
import { queryKey, commuteStatusList, toastData, COMMUTE_STATUS } from '../../../constants';

type CommuteRecordAction = 'ADD' | 'EDIT';

interface RecordModalProps {
	id: string;
	type: ModalDataType;
	action: CommuteRecordAction;
	data: ServiceDataType<CommuteRecord>;
	onClose: () => void;
}

/**
 * 1. 출근 버튼
 * 2. 상세 UI
 * 	- date
 *  - status
 *  - workplace
 *  - notes
 *
 */

// TODO: add & Edit 을 조건부로 같은 RecordModal 활용?

/**
 *
 * 조건부 렌더링 시 차이
 * - 'add' | 'edit'
 * - id type data
 * - defaultValues
 * - handleSubmit
 * - form 하위 elements
 */

const getDefaultValues = (action: CommuteRecordAction, data: ServiceDataType<CommuteRecord>) => {
	if (action === 'ADD') {
		return {
			status: COMMUTE_STATUS.PRESENT,
			workplace: '',
			notes: '',
		};
	}

	if (action === 'EDIT') {
		return {
			status: data?.status,
			workplace: data?.workplace,
			notes: data?.notes,
		};
	}
};

const RecordModal = ({ id, type, action, data: serviceData, onClose }: RecordModalProps) => {
	const { queryClient, session } = useClientSession();

	const {
		register,
		watch,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<RecordSchema>({
		resolver: zodResolver(recordSchema),
		defaultValues: getDefaultValues(action, serviceData),
	});

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (data: RecordSchema) => {
		if (!serviceData?.date) return;

		const { date } = serviceData;

		const actionProperty = action === 'ADD' ? 'CREATE' : 'EDIT';

		try {
			const callback =
				action === 'ADD'
					? addCommute({
							...data,
							user_id: session?.user?.id,
							date,
							created_at: date,
							updated_at: date,
					  })
					: updateCommute({
							...data,
							id: serviceData?.id,
							user_id: session?.user?.id,
							updated_at: date,
					  });

			await startTransition(callback);

			onClose();
			addToast(toastData.COMMUTE_RECORDS[actionProperty].SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.COMMUTE_RECORDS[actionProperty].ERROR);
		} finally {
			const _date = new Date(date);

			queryClient.invalidateQueries({
				queryKey: [...queryKey.COMMUTE_RECORDS, `${_date.getFullYear()}-${(_date.getMonth() + 1 + '').padStart(2, '0')}`],
			});
		}
	};

	return (
		<ModalLayout id={id} type={type} title={'Add Record'} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<StatusSelect
					data={commuteStatusList}
					currentValue={watch('status')}
					error={errors['status']}
					onSelect={data => {
						setValue('status', data, { shouldValidate: true, shouldTouch: true });

						if (watch('status') === 'absent') {
							setValue('workplace', 'resting');
						}
					}}
				/>
				<TextInput errorMessage={errors['workplace']?.message}>
					<TextInput.TextField id="workplace" {...register('workplace')} placeholder="Workplace" variant="sm" />
				</TextInput>
				<TextInput errorMessage={errors['notes']?.message}>
					<TextInput.TextField id="notes" {...register('notes')} placeholder="Notes" variant="sm" />
				</TextInput>
				<SubmitButton type="submit">{isLoading ? Loading : 'Get to work'}</SubmitButton>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-top: 16px;
	padding: calc(var(--padding-container-mobile) * 0.25);
	width: 100%;
	cursor: pointer;
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

export default RecordModal;
