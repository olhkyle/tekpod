import supabase from './service';
import { Todo } from './schema';

const TABLE = 'todos';

const getTodos = async (): Promise<Todo[]> => {
	const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addTodo = async (data: Omit<Todo, 'id' | 'reminder_time' | 'notified' | 'tags'>) => {
	const { error: addTodoError } = await supabase.from(TABLE).insert(data).select();

	if (addTodoError) {
		throw new Error(addTodoError.message);
	}
};

const editTodoContent = async ({ id, content }: { id: string; content: string }) => {
	const { error } = await supabase.from(TABLE).update({ content }).eq('id', id);

	if (error) {
		throw new Error(error.message);
	}
};

const editTodoDetail = async () => {};

const updatedTodoCompleted = async ({ id, completed, updated_at }: { id: string; completed: boolean; updated_at: Date }) => {
	const { error: updateTodoCompletedError } = await supabase.from(TABLE).update({ completed, updated_at }).eq('id', id);

	if (updateTodoCompletedError) {
		throw new Error(updateTodoCompletedError.message);
	}
};

const removeTodo = async ({ id }: { id: string }) => {
	const { error: deleteTodoError } = await supabase.from(TABLE).delete().eq('id', id);

	if (deleteTodoError) {
		throw new Error(deleteTodoError.message);
	}
};

export { getTodos, addTodo, editTodoContent, editTodoDetail, updatedTodoCompleted, removeTodo };
