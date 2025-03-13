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
} from '.';

type ModalDataType = 'diary' | 'filmRecipe' | 'financialLedger' | 'user' | 'todoReminder';

type ModalConfigItem = {
	type: ModalDataType;
	Component: ElementType;
};

type ModalConfig = {
	FINANCIAL_LEDGER: {
		ADD: ModalConfigItem;
	};
	FILM_RECIPE: {
		READ: ModalConfigItem;
		ADD: ModalConfigItem;
		REMOVE: ModalConfigItem;
	};
	DIARY: {
		EDIT: ModalConfigItem;
	};
	USER: {
		RESET_PASSWORD: ModalConfigItem;
		PROFILE: ModalConfigItem;
	};
	TODO_REMINDER: {
		EDIT: ModalConfigItem;
	};
};

const modalType = {
	FINANCIAL_LEDGER: 'financialLedger',
	FILM_RECIPE: 'filmRecipe',
	DIARY: 'diary',
	USER: 'user',
	TODO_REMINDER: 'todoReminder',
} as const;

const MODAL_CONFIG: ModalConfig = {
	FINANCIAL_LEDGER: {
		ADD: {
			type: modalType.FINANCIAL_LEDGER,
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
};

export type { ModalDataType };
export { MODAL_CONFIG };
