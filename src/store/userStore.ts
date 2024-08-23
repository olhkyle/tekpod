import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

/**
 * Session {
 * 	access_token: string
 * 	refresh_token: string
 * 	expires_in: number
 * 	expires_at?: number
 * 	token_type: string
 *	user: User
 * }
 */

interface UserState {
	userInfo: Session | null;
	setUserData: (data: Session | null) => void;
	resetUser: () => void;
}

const useUserStore = create<UserState>(set => ({
	userInfo: null,
	setUserData(data) {
		set(() => ({
			userInfo: data,
		}));
	},
	resetUser() {
		set({ userInfo: null });
	},
}));

export default useUserStore;
