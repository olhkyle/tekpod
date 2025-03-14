import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { EmptyMessage, TodoItem } from '..';
import { getTodos } from '../../supabase';
import { queryKey } from '../../constants';

const TodoList = () => {
	const { data: todoList } = useSuspenseQuery({ queryKey: queryKey.TODOS, queryFn: getTodos });

	return (
		<>
			{todoList.length === 0 ? (
				<EmptyMessage emoji={'🔄'}>Add New Reminder</EmptyMessage>
			) : (
				<Container>
					{todoList.map((todo, idx) => (
						<TodoItem key={todo.id} todo={todo} order={idx} />
					))}
				</Container>
			)}
		</>
	);
};

const Container = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 24px;
	margin-top: 8px;
	padding: calc(var(--padding-container-mobile) * 1) 0 calc(var(--padding-container-mobile) * 3);
`;

export default TodoList;
