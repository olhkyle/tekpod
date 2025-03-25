import supabase from './service';
import { Todo } from './schema';

const TABLE = import.meta.env.VITE_SUPABASE_DB_TABLE_TODOS;

const getTodos = async (): Promise<Todo[]> => {
	const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data.map(item => ({
		...item,
		created_at: new Date(item.created_at),
		updated_at: new Date(item.updated_at),
		reminder_time: item.reminder_time ? new Date(item.reminder_time) : null,
	}));
};

const addTodo = async (data: Omit<Todo, 'id' | 'reminder_time' | 'notified'>) => {
	const { error: addTodoError } = await supabase.from(TABLE).insert(data).select();

	if (addTodoError) {
		throw new Error(addTodoError.message);
	}
};

const editTodoContent = async ({ id, content, updated_at }: { id: string; content: string; updated_at: string }) => {
	const { error } = await supabase.from(TABLE).update({ content, updated_at }).eq('id', id);

	if (error) {
		throw new Error(error.message);
	}
};

const editTodoDetail = async ({
	id,
	content,
	tags,
	reminder_time,
	updated_at,
}: {
	id: string;
	content: string;
	tags: string[];
	reminder_time: string;
	updated_at: string;
}) => {
	const { error } = await supabase.from(TABLE).update({ content, tags, reminder_time, updated_at }).eq('id', id);

	if (error) {
		throw new Error(error.message);
	}
};

const updatedTodoCompleted = async ({ id, completed, updated_at }: { id: string; completed: boolean; updated_at: string }) => {
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
