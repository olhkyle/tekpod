import { Todo } from './schema';
import supabase from './service';

const TABLE = 'todos';

const getTodos = async (): Promise<Todo[]> => {
	const { data, error } = await supabase.from(TABLE).select('*');

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addTodo = async (data: Omit<Todo, 'id'>) => {
	const { error: addTodoError } = await supabase.from(TABLE).insert(data).select();

	if (addTodoError) {
		throw new Error(addTodoError.message);
	}
};

export { getTodos, addTodo };
