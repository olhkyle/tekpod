import { ElementType } from 'react';
import {
	AddPaymentModal,
	AddFilmRecipeModal,
	FilmRecipeModal,
	RemoveFilmRecipeConfirmModal,
	EditDiaryContentModal,
	ResetPasswordForEmailModal,
	UpdateProfileModal,
	TodoItemEditModal,
	RecordModal,
} from '.';

type ModalDataType = (typeof modalType)[keyof typeof modalType];
type ModalAction = 'ADD' | 'READ' | 'EDIT' | 'REMOVE' | 'RESET_PASSWORD' | 'PROFILE' | string; // TODO: string & NonNullable<unknown>

type ModalConfigItem = {
	type: ModalDataType;
	Component: ElementType;
};

type ModalConfig = {
	[DATA_TYPE in Uppercase<ModalDataType>]: {
		[ACTION in ModalAction]: ModalConfigItem;
	};
};

const modalType = {
	EXPENSE_TRACKER: 'expense_tracker',
	FILM_RECIPE: 'film_recipe',
	DIARY: 'diary',
	USER: 'user',
	TODO_REMINDER: 'todo_reminder',
	COMMUTE_RECORDS: 'commute_records',
} as const;

const MODAL_CONFIG: ModalConfig = {
	EXPENSE_TRACKER: {
		ADD: {
			type: modalType.EXPENSE_TRACKER,
			Component: AddPaymentModal,
		},
	},
	FILM_RECIPE: {
		READ: {
			type: modalType.FILM_RECIPE,
			Component: FilmRecipeModal,
		},
		ADD: {
			type: modalType.FILM_RECIPE,
			Component: AddFilmRecipeModal,
		},
		REMOVE: {
			type: modalType.FILM_RECIPE,
			Component: RemoveFilmRecipeConfirmModal,
		},
	},
	DIARY: {
		EDIT: {
			type: modalType.DIARY,
			Component: EditDiaryContentModal,
		},
	},
	USER: {
		RESET_PASSWORD: {
			type: modalType.USER,
			Component: ResetPasswordForEmailModal,
		},
		PROFILE: {
			type: modalType.USER,
			Component: UpdateProfileModal,
		},
	},
	TODO_REMINDER: {
		EDIT: {
			type: modalType.TODO_REMINDER,
			Component: TodoItemEditModal,
		},
	},
	COMMUTE_RECORDS: {
		ADD: {
			type: modalType.COMMUTE_RECORDS,
			Component: RecordModal,
		},
		EDIT: {
			type: modalType.COMMUTE_RECORDS,
			Component: RecordModal,
		},
	},
};

export type { ModalDataType };
export { MODAL_CONFIG };
