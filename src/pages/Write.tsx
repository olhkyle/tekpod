import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FloatingActionButton, TagsInput, TextArea, TextInput, WriteSchema, writeSchema } from '../components';
import { addDiary } from '../supabase';
import { useClientSession, useLoading } from '../hooks';
import { useToastStore } from '../store';
import { queryKey, routes, toastData } from '../constants';

const WritePage = () => {
	const { queryClient, session } = useClientSession();
	const navigate = useNavigate();

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<WriteSchema>({ resolver: zodResolver(writeSchema), defaultValues: { tags: [] } });

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (data: WriteSchema) => {
		const currentTime = new Date().toISOString();

		try {
			const { error } = await startTransition(
				addDiary({
					...data,
					user_id: session?.user?.id,
					created_at: currentTime,
					updated_at: currentTime,
					tags: data.tags.map(({ tag }) => tag),
				}),
			);

			if (error) {
				throw new Error(error.message);
			}

			addToast(toastData.DIARY.CREATE.SUCCESS);
			navigate(routes.DIARY);
		} catch (e) {
			console.error(e);
			addToast(toastData.DIARY.CREATE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.DIARY_BY_PAGE });
		}
	};

	return (
		<Container>
			<Header>
				<Title>✍🏻</Title>
			</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Wrapper>
					<TextInput errorMessage={errors?.title?.message}>
						<TextInput.TextField id="title" {...register('title')} placeholder="✨ Title" />
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
						render={({ field: { name, value, onChange } }) => <TagsInput inputId={name} tags={value} onChange={onChange} />}
					/>
				</Wrapper>
				<UploadButton type={'submit'} variant={'button'}>
					{isLoading ? Loading : 'Upload'}
				</UploadButton>
			</Form>
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

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 16px;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const UploadButton = styled(FloatingActionButton)`
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--blue200);

	&:hover,
	&:focus {
		background-color: var(--blue400);
	}
`;

export default WritePage;
