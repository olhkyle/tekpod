import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { EmptyMessage, LoadingSpinner, MODAL_CONFIG, TodoItem } from '..';
import { getTodosByPage, getTodosPageInfo, TODOS_PAGE_SIZE } from '../../supabase';
import { useGetPaginationInfo, useInfinityScroll } from '../../hooks';
import { queryKey, staleTime } from '../../constants';
import { ControlOption } from '../../pages/TodoReminder';
import { useModalStore } from '../../store';

interface TodoListProps {
	controlOption: ControlOption;
}

const TodoList = ({ controlOption }: TodoListProps) => {
	const { calculatedTotalPage } = useGetPaginationInfo({
		queryKey: queryKey.TODOS_PAGE_INFO,
		queryFn: getTodosPageInfo,
		staleTime: staleTime.TODOS.PAGE_INFO,
		pageSize: TODOS_PAGE_SIZE,
	});

	const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery({
		queryKey: queryKey.TODOS_BY_PAGE,
		queryFn: ({ pageParam }) => getTodosByPage(pageParam, TODOS_PAGE_SIZE),
		initialPageParam: 1,
		getNextPageParam: (lastPage, __, lastPageParam) => {
			const currentPageSize = lastPage.length ?? 0;

			if (currentPageSize && lastPageParam < calculatedTotalPage) {
				return lastPageParam + 1;
			}

			return undefined;
		},
		staleTime: staleTime.TODOS.ALL_WITH_PAGINATION,
	});

	const { state } = useLocation() as { state: { todo_id: string; openModal: boolean } };
	const { setModal } = useModalStore();

	const [activeEditingTodoItemId, setActiveEditingTodoItemId] = useState<string | null>(null);
	const [activeDraggingTodoItemId, setActiveDraggingTodoItemId] = useState<string | null>(null);

	const targetRef = useInfinityScroll(fetchNextPage);

	const filteredData = data.pages
		.flat()
		?.filter(todo =>
			controlOption === 'Checked' ? todo.completed === true : controlOption === 'Unchecked' ? todo.completed === false : true,
		);

	// todo -> 만들고 ,수정하고, 삭제하고, 뒤로가기, 뒤로가기 에러
	useEffect(() => {
		if (state?.todo_id && state?.openModal) {
			setModal({
				Component: MODAL_CONFIG.TODO_REMINDER.EDIT.Component,
				props: {
					type: MODAL_CONFIG.TODO_REMINDER.EDIT.type,
					data: filteredData.find(todo => todo.id === state?.todo_id)!,
				},
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			{data.pages.flat().length === 0 ? (
				<EmptyMessage emoji={'🔄'}>Add New Reminder</EmptyMessage>
			) : (
				<Container>
					{filteredData.map(todo => (
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
			{hasNextPage && (
				<LoadingArea ref={targetRef}>
					<LoadingSpinner />
				</LoadingArea>
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

const LoadingArea = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 2);
`;

export default TodoList;
