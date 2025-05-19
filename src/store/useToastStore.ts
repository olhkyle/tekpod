import { create } from 'zustand';

interface Toast {
	status: 'success' | 'warn' | 'info' | 'error';
	message: string;
}

interface ToastState {
	toast: Toast | null;
	addToast: (newToast: Toast) => void;
	removeToast: () => void;
}

const status = {
	SUCCESS: 'success',
	WARN: 'warn',
	INFO: 'info',
	ERROR: 'error',
} as const;

const useToastStore = create<ToastState>(set => ({
	toast: null,
	addToast(newToast) {
		set(state => ({ ...state, toast: newToast }));
	},
	removeToast() {
		set(state => ({ ...state, toast: null }));
	},
}));

export type { Toast };
export { status, useToastStore };
