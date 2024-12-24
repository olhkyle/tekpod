import { TouchEvent, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { RiCloseFill } from 'react-icons/ri';
import type { Todo } from '../../supabase/schema';
import { Button, Checkbox } from '../common';
import { useClickOutside, useLoading } from '../../hooks';
import useToastStore from '../../store/useToastStore';
import { removeTodo } from '../../supabase/todos';
import queryKey from '../../constants/queryKey';

interface TodoProps {
	todo: Todo;
	order: number;
}

const TodoItem = ({ todo, order }: TodoProps) => {
	const queryClient = useQueryClient();
	const [isCompleted, setIsCompleted] = useState(todo?.completed);

	const { addToast } = useToastStore();
	const { Loading, isLoading, startTransition } = useLoading();

	const [dragX, setDragX] = useState(0);
	const dragRef = useRef<number>(0);

	const containerRef = useClickOutside<HTMLLIElement>({
		eventHandler: () => {
			setDragX(0);
			dragRef.current = 0;
		},
	});

	const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		dragRef.current = event.touches[0].clientX;
	};

	const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
		if (!dragRef.current) return;

		const currentX = event.touches[0].clientX;
		const diff = currentX - dragRef.current; // 현재 위치 - 첫 터치 드래그 시작 위치 (음수)

		if (diff < 0) {
			setDragX(Math.max(diff, -80));
		}
	};

	// TODO: web-socket 연결로 reminder 만들기

	const handleRemoveTodo = async () => {
		try {
			await startTransition(removeTodo({ id: todo.id }));

			addToast({ status: 'success', message: 'Successfully remove todo' });
		} catch (error) {
			console.error(error);
			addToast({ status: 'error', message: 'Error happens during removing todo' });
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		}
	};
	return (
		<Container ref={containerRef}>
			<DeleteBackground onClick={handleRemoveTodo}>{isLoading ? Loading : <RiCloseFill size="24" color="white" />}</DeleteBackground>
			<TodoContent dragX={dragX} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
				<Flex>
					<Checkbox id={order} checked={isCompleted} onCheckedChange={setIsCompleted} />
					<Label htmlFor={`checkbox-${order + 1}`}>{todo.content}</Label>
				</Flex>
				{isCompleted && dragX >= 0 && (
					<DeleteButton type="button" onClick={handleRemoveTodo}>
						{isLoading ? Loading : <RiCloseFill size="24" color="var(--black)" />}
					</DeleteButton>
				)}
			</TodoContent>
		</Container>
	);
};

const Container = styled.li`
	position: relative;
	overflow: hidden;
`;

const DeleteBackground = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 60px;
	background-color: var(--orange800);
`;

const TodoContent = styled.div<{ dragX: number }>`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: var(--white);
	border-radius: ${({ dragX }) => (dragX < 0 ? 'var(--radius-s)' : 0)};
	transform: ${({ dragX }) => `translateX(${dragX}px)`};
	transition: transform 0.1s ease-out;
	z-index: 1;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
`;

const Label = styled.label`
	font-size: var(--fz-h7);
`;

const DeleteButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
	background-color: var(--greyOpacity50);
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);
	transition: background 0.15s ease-in-out;

	&:hover,
	&:active {
		background-color: var(--greyOpacity100);
	}
`;

export default TodoItem;
