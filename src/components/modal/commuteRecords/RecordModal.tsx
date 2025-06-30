/* eslint-disable no-mixed-spaces-and-tabs */
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalDataType, ModalLayout } from '..';
import { StatusSelect, Button, TextInput, Flex } from '../..';
import { recordSchema, RecordSchema } from './schema';
import { addCommute, CommuteRecord, removeCommute, ServiceDataType, updateCommute } from '../../../supabase';
import { useClientSession, useLoading } from '../../../hooks';
import { useToastStore } from '../../../store';
import { queryKey, commuteStatusList, toastData, COMMUTE_STATUS } from '../../../constants';
import { isEqual } from 'es-toolkit';

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

const userAction = {
	ADD: 'ADD',
	EDIT: 'EDIT',
	REMOVE: 'REMOVE',
} as const;

const getDefaultValues = (action: CommuteRecordAction, data: ServiceDataType<CommuteRecord>) => {
	if (action === userAction.ADD) {
		return {
			status: COMMUTE_STATUS.PRESENT,
			workplace: '',
			notes: '',
		};
	}

	if (action === userAction.EDIT) {
		return {
			status: data?.status,
			workplace: data?.workplace,
			notes: data?.notes,
		};
	}
};

const RecordModal = ({ id, type, action, data: serviceData, onClose }: RecordModalProps) => {
	const { queryClient, session } = useClientSession();
	const defaultValues = getDefaultValues(action, serviceData);

	const {
		register,
		watch,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<RecordSchema>({
		resolver: zodResolver(recordSchema),
		defaultValues,
	});

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const handleEditCommute = async () => {
		try {
			if (serviceData?.id) {
				await startTransition(removeCommute({ id: serviceData?.id }));

				addToast(toastData.COMMUTE_RECORDS.REMOVE.SUCCESS);
			}
		} catch (e) {
			console.error(e);
			addToast(toastData.COMMUTE_RECORDS.REMOVE.ERROR);
		} finally {
			if (serviceData?.date) {
				const _date = new Date(serviceData?.date);
				onClose();

				queryClient.invalidateQueries({
					queryKey: [...queryKey.COMMUTE_RECORDS, `${_date.getFullYear()}-${(_date.getMonth() + 1 + '').padStart(2, '0')}`],
				});
			}
		}
	};

	const onSubmit = async (data: RecordSchema) => {
		if (!serviceData?.date) return;

		const { date } = serviceData;

		const actionProperty = action === userAction.ADD ? 'CREATE' : userAction.EDIT;

		try {
			const callback =
				action === userAction.ADD
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

			if (action === 'EDIT' && isEqual(defaultValues, data)) {
				addToast(toastData.COMMUTE_RECORDS.CUSTOM('warn', 'Notes are not changed'));
				return;
			}

			await startTransition(callback);

			addToast(toastData.COMMUTE_RECORDS[actionProperty].SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.COMMUTE_RECORDS[actionProperty].ERROR);
		} finally {
			const _date = new Date(date);
			onClose();

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
				<ButtonGroup justifyContent={'space-between'} gap={'16px'} width={'100%'}>
					{action === 'EDIT' && (
						<DeleteButton type="button" onClick={handleEditCommute}>
							Delete
						</DeleteButton>
					)}
					<SubmitButton type="submit">{isLoading ? Loading : 'Get to work'}</SubmitButton>
				</ButtonGroup>
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

const ButtonGroup = styled(Flex)`
	margin-top: 16px;
`;

const DeleteButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	color: var(--black);
	background-color: var(--white);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:active,
	&:focus {
		background-color: var(--grey100);
	}
`;

const SubmitButton = styled(Button)`
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
