import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCloseFill } from 'react-icons/ri';
import { RiInformation2Line } from 'react-icons/ri';
import { MODAL_CONFIG, Button, Checkbox, TextInput } from '..';
import { todoItemSchema, TodoItemSchema } from '.';
import { type Todo, editTodoContent, removeTodo, updatedTodoCompleted } from '../../supabase';
import { useDrag, useLoading } from '../../hooks';
import { useToastStore, useModalStore } from '../../store';
import { toastData, queryKey } from '../../constants';
import { today } from '../../utils';

interface TodoProps {
	todo: Todo;
	order: number;
}

const TodoItem = ({ todo, order }: TodoProps) => {
	const queryClient = useQueryClient();
	const { control, setFocus, handleSubmit } = useForm<TodoItemSchema>({
		resolver: zodResolver(todoItemSchema),
		defaultValues: { content: todo?.content },
	});

	const [isCompleted, setIsCompleted] = useState(todo?.completed);
	const [isContentEditing, setIsContentEditing] = useState(false);

	const { addToast } = useToastStore();
	const { startTransition, Loading, isLoading } = useLoading();
	const { setModal } = useModalStore();

	const {
		dragX,
		dragContainerRef,
		handlers: { handleTouchStart, handleTouchMove, handleTouchEnd },
	} = useDrag();

	// TODO:
	useEffect(() => {
		if (isContentEditing) {
			setFocus('content');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isContentEditing]);

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

	const handleTodoItemEditModal = () => {
		setModal({
			Component: MODAL_CONFIG.TODO_REMINDER.EDIT.Component,
			props: {
				type: MODAL_CONFIG.TODO_REMINDER.EDIT.type,
				data: todo,
			},
		});
	};

	// TODO: 깜빡임 현상 해결
	const onSubmit = async (formData: TodoItemSchema) => {
		try {
			const { error } = await editTodoContent({ id: todo?.id, content: formData.content });

			if (error) {
				throw new Error(error.message);
			}

			setIsContentEditing(false);
			addToast(toastData.TODO_REMINDER.EDIT.SUCCESS);

			queryClient.invalidateQueries({ queryKey: queryKey.TODOS });
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.EDIT.ERROR);
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
							<ContentEditingForm onSubmit={handleSubmit(onSubmit)}>
								<Controller
									name="content"
									control={control}
									render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
										<TextInput errorMessage={error?.message}>
											<TextInput.ControlledTextField
												id="todoItem_content"
												name={name}
												value={value}
												placeholder="Change content"
												variant="md"
												onChange={onChange}
												onBlur={onBlur}
												onKeyDown={e => {
													if (e.key === 'Escape') {
														setIsContentEditing(false);
													}
												}}
											/>
										</TextInput>
									)}
								/>
								<ContentEditingInfoButton type="button" onClick={handleTodoItemEditModal}>
									<RiInformation2Line size="22" color="var(--grey600)" />
								</ContentEditingInfoButton>
								<TodoItemContentSubmitButton type="submit">Submit</TodoItemContentSubmitButton>
							</ContentEditingForm>
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

const ContentEditingForm = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const ContentEditingInfoButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.75);

	&:hover {
		background-color: var(--grey50);
	}
`;

const TodoItemContentSubmitButton = styled(Button)`
	display: none;
`;

const Label = styled.p`
	padding: calc(var(--padding-container-mobile) * 0.75);
	font-size: var(--fz-h7);
	word-break: break-all;
	white-space: pre-wrap;
	cursor: pointer;
`;

export default TodoItem;
