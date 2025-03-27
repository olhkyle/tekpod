import { useEffect } from 'react';
import styled from '@emotion/styled';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEqual } from 'es-toolkit';
import { ModalLayout, ModalDataType } from '..';
import { Button, DatePicker, TagsInput, TextInput, editTodoItemFormSchema, EditTodoItemFormSchema, LoadingSpinner } from '../..';
import { editTodoDetail, type Todo } from '../../../supabase';
import { formatByKoreanTime, today } from '../../../utils';
import { useToastStore } from '../../../store';
import { useLoading, useRemoveTodoItemMutation } from '../../../hooks';
import { queryKey, toastData } from '../../../constants';

interface TodoItemEditModal {
	id: string;
	type: ModalDataType;
	onClose: () => void;
	data: Todo;
}

const TodoItemEditModal = ({ id: modalId, type, onClose, data: { id, content, tags, reminder_time } }: TodoItemEditModal) => {
	const queryClient = useQueryClient();
	const {
		register,
		control,
		watch,
		setValue,
		setFocus,
		formState: { errors },
		handleSubmit,
	} = useForm<EditTodoItemFormSchema>({
		resolver: zodResolver(editTodoItemFormSchema),
		defaultValues: {
			content: content,
			tags: tags?.length ? tags?.map((tag, idx) => ({ id: idx, tag })) : [],
			reminder_time: new Date(reminder_time ?? today),
		},
	});

	const { mutate: removeTodo, isPending } = useRemoveTodoItemMutation(onClose);
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	useEffect(() => {
		setFocus('content');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDeleteTodoItem = () => {
		removeTodo({ id });
	};

	const onSubmit = async (formData: EditTodoItemFormSchema) => {
		if (
			reminder_time
				? isEqual(
						{ content: formData.content, reminder_time: formatByKoreanTime(formData.reminder_time) },
						{ content, reminder_time: formatByKoreanTime(reminder_time) },
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  )
				: false
		) {
			addToast(toastData.TODO_REMINDER.EDIT.WARN);
			return;
		}

		try {
			await startTransition(
				editTodoDetail({
					...formData,
					id,
					tags: formData?.tags.length > 0 ? formData.tags.map(({ tag }) => tag) : [],
					updated_at: new Date().toISOString(),
					reminder_time: formData.reminder_time.toISOString(),
				}),
			);

			onClose();
			addToast(toastData.TODO_REMINDER.EDIT.SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.EDIT.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		}
	};

	return (
		<ModalLayout id={modalId} type={type} title={'Detail'} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<TextInput errorMessage={errors?.content?.message}>
					<TextInput.TextField id="todoItem_editModal_content" {...register('content')} placeholder="Change content" variant="lg" />
				</TextInput>
				<Controller
					name="tags"
					control={control}
					render={({ field: { name, value, onChange } }) => <TagsInput inputId={name} tags={value} onChange={onChange} />}
				/>
				<DatePicker
					selected={watch('reminder_time')}
					setSelected={(date: Date) => setValue('reminder_time', date, { shouldValidate: true })}
					error={errors['reminder_time']}
				/>
				<ButtonGroup>
					<DeleteButton type="button" onClick={handleDeleteTodoItem}>
						{isPending ? <LoadingSpinner /> : 'Delete'}
					</DeleteButton>
					<SubmitButton type="submit">{isLoading ? Loading : 'Edit'}</SubmitButton>
				</ButtonGroup>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	margin-top: 32px;
`;

const DeleteButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	color: var(--black);
	background-color: var(--white);
	border: 1px solid var(--grey200);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	@media screen and (max-width: 640px) {
		display: none;
	}

	&:active,
	&:focus,
	&:hover {
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
	&:focus,
	&:hover {
		background-color: var(--grey900);
	}
`;

export default TodoItemEditModal;
