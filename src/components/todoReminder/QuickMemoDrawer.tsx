import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { quickMemoDrawerSchema, QuickMemoDrawerSchema } from '.';
import { Button, Drawer, TextInput } from '..';
import { useDrawerStore, useToastStore } from '../../store';
import { useClientSession, useLoading } from '../../hooks';
import { addTodo } from '../../supabase';
import { toastData, routes, queryKey } from '../../constants';

const QuickMemoDrawer = () => {
	const { queryClient, session } = useClientSession();

	const { register, setValue, handleSubmit } = useForm<QuickMemoDrawerSchema>({
		resolver: zodResolver(quickMemoDrawerSchema),
	});

	const navigate = useNavigate();
	const { isOpen, close } = useDrawerStore();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (data: QuickMemoDrawerSchema) => {
		const currentTime = new Date().toISOString();

		try {
			await startTransition(
				addTodo({
					user_id: session?.user?.id,
					completed: false,
					content: data.memo,
					created_at: currentTime,
					updated_at: currentTime,
					tags: [],
				}),
			);

			addToast(toastData.TODO_REMINDER.CREATE.SUCCESS);
			close();
			setValue('memo', '');

			navigate(routes.TODO_REMINDER);
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.CREATE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS_BY_PAGE });
		}
	};

	return (
		<>
			{isOpen && (
				<Drawer position={'top'} isOpen={isOpen} close={close} title={'Quick Memo'}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<TextInput>
							<TextInput.TextField id="memo" placeholder="Something" {...register('memo')} />
						</TextInput>
						<SubmitButton type="submit">{isLoading ? Loading : 'Add'}</SubmitButton>
					</form>
				</Drawer>
			)}
		</>
	);
};

const SubmitButton = styled(Button)`
	margin-top: 16px;
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 40px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

export default QuickMemoDrawer;
