import { FormEvent, Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { BsPlus } from 'react-icons/bs';
import { Button, ShrinkMotionBlock, TextInput, TodoList, TodoListLoader } from '../components';
import { addTodo } from '../supabase';
import { useLoading } from '../hooks';
import { useToastStore } from '../store';
import { queryKey, toastData } from '../constants';

const TodoReminderPage = () => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(queryKey.AUTH) as Session;

	const [value, setValue] = useState('');
	const { addToast } = useToastStore();
	const { startTransition, Loading, isLoading } = useLoading();

	const handleTodoAdd = async (e: FormEvent) => {
		e.preventDefault();

		if (value.length === 0) {
			return addToast(toastData.TODO_REMINDER.CREATE.WARN);
		}

		const currentTime = new Date().toISOString();

		try {
			await startTransition(
				addTodo({
					user_id: session?.user?.id,
					completed: false,
					content: value,
					created_at: currentTime,
					updated_at: currentTime,
					tags: [],
				}),
			);

			addToast(toastData.TODO_REMINDER.CREATE.SUCCESS);
			setValue('');
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.CREATE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS_BY_PAGE });
		}
	};

	return (
		<Container>
			<Form onSubmit={handleTodoAdd}>
				<TextInput>
					<TextInput.ControlledTextField
						id="todo-input"
						name="todo-input"
						placeholder={'New Reminder'}
						value={value}
						onChange={e => setValue(e.target.value)}
					/>
				</TextInput>
				<ShrinkMotionBlock>
					<AddTodoButton type="submit" aria-label="Add todo">
						{isLoading ? Loading : <BsPlus size="24" color="var(--white)" />}
					</AddTodoButton>
				</ShrinkMotionBlock>
			</Form>

			<Suspense fallback={<TodoListLoader />}>
				<TodoList />
			</Suspense>
		</Container>
	);
};

const Container = styled.section`
	width: 100%;
`;

const Form = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > div:first-of-type {
		flex: 1; // make remained space for TextInput
		min-width: 250px; // make it shrinkable setting min-width: 0;
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

export default TodoReminderPage;
