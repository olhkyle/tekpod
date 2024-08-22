import styled from '@emotion/styled';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BiMessageSquareEdit } from 'react-icons/bi';
import { QueryRefetch } from '../../store/useModalStore';
import { Diary } from '../../supabase/schema';
import { ModalLayout } from '.';
import { TagsInput, TextArea, TextInput } from '..';
import { editContentSchema, EditContentSchema } from './editContentSchema';
import { useEffect, useState } from 'react';
import { Tag } from '../common/TagsInput';
import { useLoading } from '../../hooks';
import { updateDiary } from '../../supabase/diary';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants';

interface EditContentModalProps {
	id: string;
	data: Diary;
	isOpen: boolean;
	onClose: () => void;
	refetch?: QueryRefetch;
}

const EditContentModal = ({ id, data, isOpen, onClose }: EditContentModalProps) => {
	const {
		register,
		control,
		setValue,
		formState: { errors },
		handleSubmit,
	} = useForm<EditContentSchema>({
		resolver: zodResolver(editContentSchema),
	});

	const navigate = useNavigate();

	const { isLoading, Loading, startTransition } = useLoading();
	const [tags, setTags] = useState<Tag[]>([]);

	// const initialData: Diary = data;

	const onSubmit = async (updatedData: EditContentSchema) => {
		// TODO:
		// 1 .첫 데이터와 같은 경우 업데이트 하지 않고, toast 띄우도록

		try {
			const { error } = await startTransition(updateDiary({ ...data, ...updatedData, tags: tags.map(({ tag }) => tag) }));

			if (error) {
				throw new Error(error.message);
			}

			onClose();
			navigate(routes.DIARY);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setValue('title', data?.title);
		setValue('content', data?.content);
		setValue('feeling', data?.feeling);
		setTags(data?.tags!.map((tag, idx) => ({ id: idx, tag })));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setValue]);

	return (
		<ModalLayout id={id} isOpen={isOpen} title={<BiMessageSquareEdit size="32" color="var(--black)" />} onClose={onClose}>
			<Group onSubmit={handleSubmit(onSubmit)}>
				<TextInput errorMessage={errors?.title?.message}>
					<TextInput.TextField id="title" {...register('title')} placeholder="﹡ Title" />
				</TextInput>
				<Controller
					name="content"
					control={control}
					render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
						<TextArea errorMessage={error?.message}>
							<TextArea.TextField id="content" name={name} value={value} onChange={onChange} onBlur={onBlur} placeholder="→ What I did" />
						</TextArea>
					)}
				/>
				<TextInput errorMessage={errors?.feeling?.message}>
					<TextInput.TextField id="feeling" {...register('feeling')} name="feeling" placeholder="💡 One Feeling" />
				</TextInput>
				<TagsInput tags={tags} setTags={setTags} />
				<UpdateButton type="submit">{isLoading ? Loading : '👆🏻 Upload'}</UpdateButton>
			</Group>
		</ModalLayout>
	);
};

const Group = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: calc(100% - var(--nav-height));
`;

const UpdateButton = styled.button`
	margin-top: auto;
	padding: var(--padding-container-mobile);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);
	transition: background 0.15s ease-in-out;

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}
`;

export default EditContentModal;
