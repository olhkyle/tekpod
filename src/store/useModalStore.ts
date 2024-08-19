import { ReactElement } from 'react';
import { create } from 'zustand';

interface ModalState {
	modals: ReactElement[];
	setModal: (data: ReactElement) => void;
	resetModals: () => void;
}

const useModalStore = create<ModalState>(set => ({
	modals: [],
	setModal(data) {
		set(state => ({ ...state, modals: [...state.modals, data] }));
	},
	resetModals() {
		set(() => ({
			modals: [],
		}));
	},
}));

export default useModalStore;
