import { ElementType } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { create } from 'zustand';
import { Diary, RestrictedRecipe } from '../supabase/schema';
import { ModalDataType } from '../components/modal/modalType';

export type QueryRefetch = (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<UseQueryResult>;

interface Modal {
	Component: ElementType;
	props?: {
		data: Diary | RestrictedRecipe | null;
		isOpen: boolean;
		type: ModalDataType;
		refetch?: QueryRefetch;
		onTopLevelModalClose?: () => void;
	};
}

interface ModalState {
	modals: Modal[];
	setModal: (data: Modal) => void;
	removeModal: (Component: ElementType) => void;
	resetModals: () => void;
}

const useModalStore = create<ModalState>(set => ({
	modals: [],
	setModal(data) {
		set(state => ({ ...state, modals: [...state.modals, data] }));
	},
	removeModal(component) {
		set(state => ({ ...state, modals: state.modals.filter(({ Component }) => Component !== component) }));
	},
	resetModals() {
		set(() => ({
			modals: [],
		}));
	},
}));

export default useModalStore;
