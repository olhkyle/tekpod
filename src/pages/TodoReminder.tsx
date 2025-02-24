import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { BsPlus } from 'react-icons/bs';
import { Button, EmptyMessage, TextInput, TodoItem } from '../components';
import { addTodo, getTodos } from '../supabase/todos';
import { useLoading } from '../hooks';
import useToastStore from '../store/useToastStore';
import queryKey from '../constants/queryKey';
import { toastData } from '../constants/toast';

const TodoReminderPage = () => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;

	const { data: todoList } = useSuspenseQuery({ queryKey: queryKey.TODOS, queryFn: getTodos });

	const [value, setValue] = useState('');
	const { addToast } = useToastStore();
	const { Loading, isLoading, startTransition } = useLoading();

	const handleTodoAdd = async () => {
		const currentKoreanTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

		if (value.length === 0) {
			return addToast(toastData.TODO_REMINDER.CREATE.WARN);
		}

		try {
			await startTransition(
				addTodo({
					user_id: session?.user?.id,
					completed: false,
					content: value,
					created_at: currentKoreanTime,
					updated_at: currentKoreanTime,
				}),
			);

			addToast(toastData.TODO_REMINDER.CREATE.SUCCESS);
			setValue('');
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.CREATE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		}
	};

	// TODO: 각 아이템을 길게 클릭 시 상단에서 전체 선택 등의 부가기능 선택할 수 있는 TopSheet 나오도록
	return (
		<Container>
			<Flex>
				<TextInput>
					<TextInput.ControlledTextField
						id="todo-input"
						name="todo-input"
						placeholder={'New Reminder'}
						value={value}
						onChange={e => setValue(e.target.value)}
					/>
				</TextInput>
				<motion.div
					initial="rest"
					whileTap={{
						scale: 0.95,
						transition: { duration: 0.2 },
					}}>
					<AddTodoButton type="button" onClick={handleTodoAdd}>
						{isLoading ? Loading : <BsPlus size="24" color="var(--white)" />}
					</AddTodoButton>
				</motion.div>
			</Flex>

			<Suspense fallback={Loading}>
				{todoList.length === 0 ? (
					<EmptyMessage emoji={'🔄'}>Add New Reminder</EmptyMessage>
				) : (
					<TodoList>
						{todoList.map((todo, idx) => (
							<TodoItem key={todo.id} todo={todo} order={idx} />
						))}
					</TodoList>
				)}
			</Suspense>
		</Container>
	);
};

const Container = styled.section`
	width: 100%;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > div:first-of-type {
		flex: 1; // TextInput이 남은 공간을 차지하되
		min-width: 250px; // 최소 너비를 0으로 설정하여 축소 가능하게 함
	}
`;

const AddTodoButton = styled(Button)`
	padding: 16px;
	min-width: 56px;
	min-height: 56px;
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);
	border-radius: var(--radius-xs);
`;

const TodoList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: calc(var(--padding-container-mobile) * 1) 0 calc(var(--padding-container-mobile) * 3);
`;

export default TodoReminderPage;
