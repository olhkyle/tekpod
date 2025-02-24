import { TouchEvent, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { RiCloseFill } from 'react-icons/ri';
import type { Todo } from '../../supabase/schema';
import { Button, Checkbox } from '../common';
import { useClickOutside, useLoading } from '../../hooks';
import useToastStore from '../../store/useToastStore';
import { removeTodo, updatedTodoCompleted } from '../../supabase/todos';
import queryKey from '../../constants/queryKey';
import { toastData } from '../../constants/toast';

interface TodoProps {
	todo: Todo;
	order: number;
}

const DRAG_THRESHOLD = 10; // 픽셀 단위

const TodoItem = ({ todo, order }: TodoProps) => {
	const queryClient = useQueryClient();
	const [isCompleted, setIsCompleted] = useState(todo?.completed);

	const { addToast } = useToastStore();
	const { Loading, isLoading, startTransition } = useLoading();

	const [dragX, setDragX] = useState(0);
	const [dragStartX, setDragStartX] = useState<number | null>(null);
	const dragRef = useRef<number>(0);

	const containerRef = useClickOutside<HTMLLIElement>({
		eventHandler: () => {
			setDragX(0);
			dragRef.current = 0;
		},
	});

	// TODO: 리팩토링 필요
	const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		setDragStartX(event.touches[0].clientX);
		dragRef.current = event.touches[0].clientX;
	};

	const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
		if (dragStartX === null) return;

		const currentX = event.touches[0].clientX;
		const diff = currentX - dragRef.current; // 현재 위치 - 첫 터치 드래그 시작 위치 (음수)

		// 최소 이동 거리를 넘어선 경우에만 드래그 적용
		if (Math.abs(diff) > DRAG_THRESHOLD) {
			const dampingFactor = 0.8;
			const dragAmount = currentX - dragRef.current;
			if (dragAmount < 0) {
				setDragX(Math.max(dampingFactor * dragAmount, -80));
			}
		}
	};

	const handleTouchEnd = () => {
		const SNAP_THRESHOLD = -40;

		if (dragX < SNAP_THRESHOLD) {
			setDragX(-80);
		} else {
			setDragX(0);
		}

		setDragStartX(null);
		dragRef.current = 0;
	};

	// TODO: web-socket 연결로 reminder 만들기

	const handleTodoIsCompleted = async (completed: boolean) => {
		try {
			await startTransition(updatedTodoCompleted({ id: todo.id, completed, updated_at: new Date() }));
			addToast(toastData.TODO_REMINDER.EDIT.SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.EDIT.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		}
	};

	const handleRemoveTodo = async () => {
		try {
			await startTransition(removeTodo({ id: todo.id }));

			addToast(toastData.TODO_REMINDER.REMOVE.SUCCESS);
		} catch (error) {
			console.error(error);
			addToast(toastData.TODO_REMINDER.REMOVE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		}
	};

	return (
		<Container ref={containerRef}>
			<DeleteBackground onClick={handleRemoveTodo}>{isLoading ? Loading : <RiCloseFill size="24" color="white" />}</DeleteBackground>
			<TodoContent dragX={dragX} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
				<Flex>
					<Checkbox id={order} checked={isCompleted} onCheckedChange={setIsCompleted} onServerTodoCompletedChange={handleTodoIsCompleted} />
					<Label htmlFor={`checkbox-${order + 1}`}>{todo.content}</Label>
				</Flex>
				<DeleteButtonSafeBoundary>
					{isCompleted && dragX >= 0 && (
						<DeleteButton type="button" onClick={handleRemoveTodo}>
							<RiCloseFill size="24" color="var(--black)" />
						</DeleteButton>
					)}
				</DeleteButtonSafeBoundary>
			</TodoContent>
		</Container>
	);
};

const Container = styled.li`
	position: relative;
	overflow: hidden;
	cursor: pointer;
`;

const DeleteBackground = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 65px;
	background-color: var(--orange800);
`;

const TodoContent = styled.div<{ dragX: number }>`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	height: 100%;
	background-color: var(--white);
	border-radius: ${({ dragX }) => (dragX < 0 ? 'var(--radius-s)' : 0)};
	transform: ${({ dragX }) => `translateX(${dragX}px)`};
	transition: transform 0.1s ease-out;
	z-index: 1;
	cursor: pointer;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
`;

const Label = styled.label`
	font-size: var(--fz-h7);
	word-break: break-all;
	white-space: pre-wrap;
	cursor: pointer;
`;

const DeleteButtonSafeBoundary = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	min-width: 42px;
	height: 100%;
	background-color: var(--white);
`;

const DeleteButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
	background-color: var(--greyOpacity50);
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);

	&:hover,
	&:active {
		background-color: var(--greyOpacity100);
	}
`;

export default TodoItem;
