import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Session } from '@supabase/supabase-js';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TagsInput, TextArea, TextInput } from '../components';
import { WriteSchema, writeSchema } from '../components/write/schema';
import { addDiary } from '../supabase/diary';
import { routes } from '../constants';
import useLoading from '../hooks/useLoading';
import useToastStore from '../store/useToastStore';
import { toastData } from '../constants/toast';

const WritePage = () => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;
	const navigate = useNavigate();

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<WriteSchema>({ resolver: zodResolver(writeSchema), defaultValues: { tags: [] } });

	const { Loading, isLoading, startTransition } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (data: WriteSchema) => {
		const today = new Date();

		try {
			const { error } = await startTransition(
				addDiary({
					...data,
					user_id: session?.user?.id,
					created_at: today,
					updated_at: today,
					tags: data.tags.map(({ tag }) => tag),
				}),
			);

			if (error) {
				throw new Error(error.message);
			}

			addToast(toastData.DIARY.CREATE.SUCCESS);
			navigate(routes.DIARY);
		} catch (error) {
			addToast(toastData.DIARY.CREATE.ERROR);
			console.error(error);
		}
	};

	return (
		<Container>
			<Header>
				<Title>✍🏻</Title>
			</Header>
			<Group onSubmit={handleSubmit(onSubmit)}>
				<Wrapper>
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
					<Controller
						name="tags"
						control={control}
						render={({ field: { value, onChange } }) => <TagsInput tags={value} onChange={onChange} />}
					/>
				</Wrapper>
				<UploadButton type="submit">{isLoading ? Loading : 'Upload'}</UploadButton>
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

const Group = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 16px;
	min-height: calc(100dvh - 4 * var(--nav-height) - var(--padding-container-mobile));
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const UploadButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-height: 57px;
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--blue200);

	&:hover,
	&:focus {
		background-color: var(--blue300);
	}
`;

export default WritePage;
