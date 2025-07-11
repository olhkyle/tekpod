import { ElementType } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { create } from 'zustand';
import { ServiceDataType, TableRowData } from '../supabase';
import { BaseModalAction, ModalDataType } from '../components';

export type QueryRefetch = (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<UseQueryResult>;

interface Modal<T = TableRowData, D = Record<string, never>> {
	Component: ElementType;
	props?: {
		type: ModalDataType;
		action?: BaseModalAction;
		data: ServiceDataType<T, D>;
		refetch?: QueryRefetch;
		onTopLevelModalClose?: () => void;
	};
}

interface ModalState {
	modals: Modal<unknown, unknown>[];
	setModal: <T = TableRowData, D = Record<string, never>>(data: Modal<T, D>) => void;
	removeModal: (Component: ElementType) => void;
	resetModals: () => void;
}

const useModalStore = create<ModalState>(set => ({
	modals: [],
	setModal(data) {
		set(state => {
			const isDuplicate = state.modals.some(
				({ Component, props }) => Component === data.Component && JSON.stringify(props?.data) === JSON.stringify(data.props?.data),
			);

			if (isDuplicate) return state;
			return { ...state, modals: [...state.modals, data] };
		});
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
