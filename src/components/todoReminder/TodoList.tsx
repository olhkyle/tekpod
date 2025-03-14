import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { EmptyMessage, TodoItem } from '..';
import { getTodos } from '../../supabase';
import { queryKey } from '../../constants';
import { useState } from 'react';

const TodoList = () => {
	const { data: todoList } = useSuspenseQuery({ queryKey: queryKey.TODOS, queryFn: getTodos });
	const [activeEditingTodoItemId, setActiveEditingTodoItemId] = useState<string | null>(null);
	const [activeDraggingTodoItemId, setActiveDraggingTodoItemId] = useState<string | null>(null);

	const handleEditingIdChange = (id: string | null) => {
		// do not make an effect on dragging
		if (id !== null) {
			setActiveDraggingTodoItemId(null);
		}

		setActiveEditingTodoItemId(id);
	};

	const handleDraggingIdChange = (id: string | null) => {
		// do not make an effect on editing
		if (id !== null) {
			setActiveEditingTodoItemId(null);
		}

		setActiveDraggingTodoItemId(id);
	};

	return (
		<>
			{todoList.length === 0 ? (
				<EmptyMessage emoji={'🔄'}>Add New Reminder</EmptyMessage>
			) : (
				<Container>
					{todoList.map(todo => (
						<TodoItem
							key={todo.id}
							id={todo.id}
							todo={todo}
							isContentEditing={activeEditingTodoItemId === todo.id}
							isDragging={activeDraggingTodoItemId === todo.id}
							onEditingIdChange={(isEditing: boolean) => handleEditingIdChange(isEditing ? todo.id : null)}
							onDraggingIdChange={(isDragging: boolean) => handleDraggingIdChange(isDragging ? todo.id : null)}
						/>
					))}
				</Container>
			)}
		</>
	);
};

const Container = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 8px;
	padding: calc(var(--padding-container-mobile) * 1) 0 calc(var(--padding-container-mobile) * 3);
`;

export default TodoList;
