import { create } from 'zustand';

interface User {
	id: string;
	email: string;
}

interface UserState {
	userInfo: User;
	setUserData: (data: User) => void;
	resetUser: () => void;
}

const userInfo = { id: '', email: '' };

const useUserStore = create<UserState>(set => ({
	userInfo,
	setUserData(data) {
		set(() => ({
			userInfo: data,
		}));
	},
	resetUser() {
		set(() => ({ userInfo }));
	},
}));

export default useUserStore;
