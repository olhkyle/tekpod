import { useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuid } from 'uuid';
import { Session } from '@supabase/supabase-js';
import { TagsInput, TextArea, TextInput } from '../components';
import { WriteSchema, writeSchema } from '../components/write/schema';
import { addDiary } from '../supabase/diary';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants';
import useLoading from '../hooks/useLoading';
import { Tag } from '../components/common/TagsInput';

const WritePage = () => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<WriteSchema>({ resolver: zodResolver(writeSchema) });

	const [tags, setTags] = useState<Tag[]>([]);
	const { Loading, isLoading, startTransition } = useLoading();

	const navigate = useNavigate();

	// TODO:
	// 1. 미리보기 Modal 띄우기
	// 2. toast 라이브러리 구현

	const onSubmit = async (data: WriteSchema) => {
		const today = new Date();

		try {
			const { error } = await startTransition(
				addDiary({
					id: uuid(),
					...data,
					user_id: session?.user?.id,
					created_at: today,
					updated_at: today,
					tags: tags.map(({ tag }) => tag),
				}),
			);

			if (error) {
				throw new Error(error.message);
			}

			navigate(routes.DIARY);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Container>
			<Header>
				<Title>✍🏻</Title>
				<Preview type="button" onClick={() => {}}>
					Preview
				</Preview>
			</Header>
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
				<UploadButton type="submit">{isLoading ? Loading : '👆🏻 Upload'}</UploadButton>
			</Group>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.h2`
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

const Preview = styled.button`
	padding: calc(var(--padding-container-mobile) / 4) calc(var(--padding-container-mobile) / 2);
	min-height: 36px;
	font-size: var(--fz-sm);
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-s);
	color: var(--grey700);
	background-color: var(--greyOpacity100);

	&:focus {
		background-color: var(--greyOpacity200);
	}
`;

const Group = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const UploadButton = styled.button`
	padding: var(--padding-container-mobile);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);

	&:focus {
		background-color: var(--grey900);
	}
`;

export default WritePage;
