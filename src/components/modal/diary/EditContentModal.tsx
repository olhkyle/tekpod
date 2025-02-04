import { useEffect } from 'react';
import styled from '@emotion/styled';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { BiMessageSquareEdit } from 'react-icons/bi';
import { Diary } from '../../../supabase/schema';
import { ModalLayout } from '..';
import { Button, TagsInput, TextArea, TextInput } from '../..';
import { editContentFormSchema, EditContentFormSchema } from './editContentSchema';
import { useLoading } from '../../../hooks';
import { updateDiary } from '../../../supabase/diary';
import { routes } from '../../../constants';
import useToastStore from '../../../store/useToastStore';
import type { ModalDataType } from '../modalType';
import { isEqual } from 'es-toolkit';

interface EditContentModalProps {
	id: string;
	data: Diary;
	type: ModalDataType;
	onClose: () => void;
}

const EditContentModal = ({ id, type, data, onClose }: EditContentModalProps) => {
	const {
		register,
		control,
		setValue,
		formState: { errors },
		handleSubmit,
	} = useForm<EditContentFormSchema>({
		resolver: zodResolver(editContentFormSchema),
		defaultValues: { tags: [] },
	});

	const navigate = useNavigate();

	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (updatedData: EditContentFormSchema) => {
		const isUnedited =
			data?.title === updatedData?.title &&
			data?.content === updatedData?.content &&
			data?.feeling === updatedData?.feeling &&
			isEqual(
				data?.tags,
				updatedData.tags.map(({ tag }) => tag),
			);

		if (isUnedited) {
			addToast({ status: 'warn', message: `Not Edited` });
			return;
		}

		try {
			const { error } = await startTransition(updateDiary({ ...data, ...updatedData, tags: updatedData.tags.map(({ tag }) => tag) }));

			if (error) {
				throw new Error(error.message);
			}

			onClose();
			addToast({ status: 'info', message: `Successfully Edited` });
			navigate(routes.DIARY);
		} catch (error) {
			addToast({ status: 'error', message: `Error with Editing` });
			console.error(error);
		}
	};

	useEffect(() => {
		setValue('title', data?.title);
		setValue('content', data?.content);
		setValue('feeling', data?.feeling);
		setValue(
			'tags',
			data?.tags!.map((tag, idx) => ({ id: idx, tag })),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setValue]);

	return (
		<ModalLayout id={id} type={type} title={<BiMessageSquareEdit size="32" color="var(--black)" />} onClose={onClose}>
			<Group onSubmit={handleSubmit(onSubmit)}>
				<TextInput errorMessage={errors?.title?.message}>
					<TextInput.TextField id="title" {...register('title')} placeholder="﹡ Title" />
				</TextInput>
				<Controller
					name="content"
					control={control}
					render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
						<TextArea errorMessage={error?.message}>
							<TextArea.TextField
								id="content"
								name={name}
								value={value}
								onChange={onChange}
								onBlur={onBlur}
								placeholder="→ What I did"
								modalType={'edit'}
							/>
						</TextArea>
					)}
				/>
				<TextInput errorMessage={errors?.feeling?.message}>
					<TextInput.TextField id="feeling" {...register('feeling')} name="feeling" placeholder="💡 One Feeling" />
				</TextInput>
				<Controller
					name="tags"
					control={control}
					render={({ field: { value, onChange } }) => <TagsInput tags={value} onChange={onChange} />}
				/>
				<UpdateButton type="submit">{isLoading ? Loading : '👆🏻 Upload'}</UpdateButton>
			</Group>
		</ModalLayout>
	);
};

const Group = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: 100%;
`;

const UpdateButton = styled(Button)`
	margin-top: auto;
	padding: var(--padding-container-mobile);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}
`;

export default EditContentModal;
