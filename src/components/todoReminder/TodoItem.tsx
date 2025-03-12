import { useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { RiCloseFill } from 'react-icons/ri';
import { RiInformation2Line } from 'react-icons/ri';
import type { Todo } from '../../supabase/schema';
import { Button, Checkbox, TextInput } from '../common';
import { useDragAndDrop, useLoading } from '../../hooks';
import useToastStore from '../../store/useToastStore';
import { removeTodo, updatedTodoCompleted } from '../../supabase/todos';
import queryKey from '../../constants/queryKey';
import { toastData } from '../../constants/toast';
import { today } from '../../utils/date';

interface TodoProps {
	todo: Todo;
	order: number;
}

const TodoItem = ({ todo, order }: TodoProps) => {
	const queryClient = useQueryClient();
	const [isCompleted, setIsCompleted] = useState(todo?.completed);
	const [isContentEditing, setIsContentEditing] = useState(false);

	const { addToast } = useToastStore();
	const { startTransition, Loading, isLoading } = useLoading();

	const {
		dragX,
		dragContainerRef,
		handlers: { handleTouchStart, handleTouchMove, handleTouchEnd },
	} = useDragAndDrop();

	// TextInput 바깥 클릭 시 TextInput에서 Label로 다시 바뀌도록 변경
	// TODO: web-socket 연결로 reminder 만들기

	const handleTodoIsCompleted = async (completed: boolean) => {
		try {
			await startTransition(updatedTodoCompleted({ id: todo.id, completed, updated_at: today }));
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
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.REMOVE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		}
	};

	return (
		<Container ref={dragContainerRef}>
			<DeleteBackground onClick={handleRemoveTodo}>{isLoading ? Loading : <RiCloseFill size="24" color="white" />}</DeleteBackground>
			<TodoContent dragX={dragX} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
				<Flex>
					<Checkbox id={order} checked={isCompleted} onCheckedChange={setIsCompleted} onServerTodoCompletedChange={handleTodoIsCompleted} />
					<ContentBoundary>
						{isContentEditing ? (
							<ContentEditingTextInputWithButton>
								<TextInput>
									<TextInput.TextField
										id="content"
										name="content"
										placeholder="Change content"
										variant="md"
										onKeyDown={e => {
											if (e.key === 'Escape') {
												setIsContentEditing(false);
											}
										}}
									/>
								</TextInput>
								<ContentEditingInfoButton type="button">
									<RiInformation2Line size="24" color="var(--grey600)" />
								</ContentEditingInfoButton>
							</ContentEditingTextInputWithButton>
						) : (
							<Label
								onClick={() => {
									setIsContentEditing(!isContentEditing);
								}}>
								{todo.content}
							</Label>
						)}
					</ContentBoundary>
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
	min-height: 60px;
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
	width: 60px;
	background-color: var(--orange800);
`;

const TodoContent = styled.div<{ dragX: number }>`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	height: 100%;
	min-height: 60px;
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
	width: 100%;
`;

const ContentBoundary = styled.div`
	width: 100%;
`;

const ContentEditingTextInputWithButton = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const ContentEditingInfoButton = styled(Button)`
	padding: var(--padding-container-mobile);
`;

const Label = styled.p`
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
