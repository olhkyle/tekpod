import { create } from 'zustand';

interface DrawerState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

const useDrawerStore = create<DrawerState>(set => ({
	isOpen: false,
	open() {
		set(state => ({ ...state, isOpen: true }));
	},
	close() {
		set(state => ({ ...state, isOpen: false }));
	},
	toggle() {
		set(state => ({ ...state, isOpen: !state.isOpen }));
	},
}));

export default useDrawerStore;
