import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quickMemoDrawerSchema, QuickMemoDrawerSchema } from './quickMemoDrawerSchema';
import { Button, Drawer, TextInput } from '../common';
import useDrawerStore from '../../store/useDrawerStore';
import { useQueryClient } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { useLoading } from '../../hooks';
import { addTodo } from '../../supabase/todos';
import { currentKoreanTime } from '../../utils/date';
import useToastStore from '../../store/useToastStore';
import { toastData } from '../../constants/toast';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants';

const QuickMemoDrawer = () => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;

	const { register, setValue, handleSubmit } = useForm<QuickMemoDrawerSchema>({
		resolver: zodResolver(quickMemoDrawerSchema),
	});

	const navigate = useNavigate();
	const { isOpen, close } = useDrawerStore();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (data: QuickMemoDrawerSchema) => {
		try {
			await startTransition(
				addTodo({
					user_id: session?.user?.id,
					completed: false,
					content: data.memo,
					created_at: currentKoreanTime,
					updated_at: currentKoreanTime,
				}),
			);

			addToast(toastData.TODO_REMINDER.CREATE.SUCCESS);
			close();
			setValue('memo', '');

			navigate(routes.TODO_REMINDER);
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.CREATE.ERROR);
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
