import { ElementType } from 'react';
import { AddPaymentModal } from './expenseTracker';
import { AddFilmRecipeModal, FilmRecipeModal, RemoveFilmRecipeConfirmModal } from './filmRecipe';
import { EditDiaryContentModal } from './diary';

type ModalDataType = 'diary' | 'filmRecipe' | 'financialLedger';

type ModalConfigItem = {
	type: ModalDataType;
	Component: ElementType;
};

interface ModalActionConfig {
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
}

type ModalConfig = {
	[Category in keyof ModalActionConfig]: {
		[Action in keyof ModalActionConfig[Category]]: ModalActionConfig[Category][Action];
	};
};

const MODAL_CONFIG: ModalConfig = {
	FINANCIAL_LEDGER: {
		ADD: {
			type: 'financialLedger',
			Component: AddPaymentModal,
		},
	},
	FILM_RECIPE: {
		READ: {
			type: 'filmRecipe',
			Component: FilmRecipeModal,
		},
		ADD: {
			type: 'filmRecipe',
			Component: AddFilmRecipeModal,
		},
		REMOVE: {
			type: 'filmRecipe',
			Component: RemoveFilmRecipeConfirmModal,
		},
	},
	DIARY: {
		EDIT: {
			type: 'diary',
			Component: EditDiaryContentModal,
		},
	},
};

export type { ModalDataType };
export { MODAL_CONFIG };
