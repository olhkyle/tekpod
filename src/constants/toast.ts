import type { Toast } from '../store/useToastStore';

const FIXED_SUCCESS_PHRASE = 'successfully';
const FIXED_ERROR_MESSAGE_PHRASE = 'Something wrong with';

const toastData = {
	DIARY: {
		CREATE: {
			SUCCESS: { status: 'success', message: `Save ${FIXED_SUCCESS_PHRASE}` },
			ERROR: {
				status: 'error',
				message: `${FIXED_ERROR_MESSAGE_PHRASE} writing`,
			},
		},
		EDIT: {
			SUCCESS: { status: 'success', message: `Edit content ${FIXED_SUCCESS_PHRASE}` },
			WARN: { status: 'warn', message: `Not edited` },
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} editing` },
		},
		REMOVE: {
			SUCCESS: { status: 'success', message: `Delete diary ${FIXED_SUCCESS_PHRASE}` },
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} removing` },
		},
	},
	TODO_REMINDER: {
		CREATE: {
			SUCCESS: { status: 'success', message: `Add ${FIXED_SUCCESS_PHRASE}` },
			WARN: { status: 'warn', message: `No value on field` },
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} adding` },
		},
		EDIT: {
			SUCCESS: { status: 'success', message: `Change todo ${FIXED_SUCCESS_PHRASE}` },
			WARN: { status: 'warn', message: `Not Edited at all` },
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} changing todo` },
		},
		REMOVE: {
			SUCCESS: {
				status: 'success',
				message: `Remove todo ${FIXED_SUCCESS_PHRASE}`,
			},
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} removing todo` },
		},
	},
	FILM_RECIPE: {
		CREATE: {
			SUBMIT: {
				SUCCESS: { status: 'success', message: `Add new ${FIXED_SUCCESS_PHRASE}` },
				WARN: { status: 'warn', message: 'Some fields are not filled' },
				ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} adding new` },
			},
			IMAGE: {
				WARN: {
					IMAGE_TYPE: { status: 'warn', message: `'image/webp' type can be uploaded only` },
					NOT_UPLOADED: { status: 'warn', message: 'Please, upload Image' },
					FILE_SIZE: { status: 'warn', message: 'File can not be uploaded over 10mb' },
				},
				ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} uploading image` },
			},
		},
		EDIT: {
			SUCCESS: { status: 'success', message: `Update ${FIXED_SUCCESS_PHRASE}` },
			ERROR: {
				TITLE_REQUIRED: (validationResult?: string) => {
					return {
						status: 'error',
						message: validationResult,
					} as Toast;
				},
				SUBMIT: {
					status: 'error',
					message: `${FIXED_ERROR_MESSAGE_PHRASE} updating recipe`,
				},
			},
		},
		REMOVE: {
			SUCCESS: {
				status: 'success',
				message: `Delete one ${FIXED_SUCCESS_PHRASE}`,
			},
			ERROR: {
				status: 'error',
				message: `${FIXED_ERROR_MESSAGE_PHRASE} deleting`,
			},
		},
	},
	EXPENSE_TRACKER: {
		CREATE: {
			SUCCESS: { status: 'success', message: `Add payment ${FIXED_SUCCESS_PHRASE}` },
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} adding` },
		},
		REMOVE: {
			SUCCESS: { status: 'success', message: `Delete ${FIXED_SUCCESS_PHRASE}` },
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} deleting` },
		},
	},
	PROFILE: {
		LOGIN: {
			SUCCESS: {
				status: 'success',
				message: `Login ${FIXED_SUCCESS_PHRASE}`,
			},
			ERROR: {
				status: 'error',
				message: `${FIXED_ERROR_MESSAGE_PHRASE} logging in`,
			},
			CUSTOM: (status: Toast['status'], message: string) => {
				return { status, message };
			},
		},
		LOGOUT: {
			SUCCESS: { status: 'success', message: `Log out ${FIXED_SUCCESS_PHRASE}` },
			ERROR: { status: 'error', message: `${FIXED_ERROR_MESSAGE_PHRASE} logout` },
			CUSTOM(status: Toast['status'], message: string) {
				return { status, message };
			},
		},
		REGISTER: {
			SUCCESS: { status: 'success', message: `Register ${FIXED_SUCCESS_PHRASE}` },
			WARN: {
				status: 'warn',
				message: 'Email is already registered',
			},
			ERROR: {
				status: 'error',
				message: `${FIXED_ERROR_MESSAGE_PHRASE} registering`,
			},
		},
		RESET_PASSWORD: {
			SUCCESS: { status: 'success', message: `Check reset password link in your Email` },
			ERROR: {
				status: 'error',
				message: `${FIXED_ERROR_MESSAGE_PHRASE} resetting password`,
			},
			CUSTOM(status: Toast['status'], message: string) {
				return { status, message };
			},
		},
		UPDATE_PASSWORD: {
			SUCCESS: { status: 'success', message: `Update password ${FIXED_SUCCESS_PHRASE}` },
			ERROR: {
				status: 'error',
				message: `${FIXED_ERROR_MESSAGE_PHRASE} updating password`,
			},
			CUSTOM(status: Toast['status'], message: string) {
				return { status, message };
			},
		},
		UPDATE_PROFILE: {
			SUCCESS: {
				status: 'success',
				message: `Update your profile ${FIXED_SUCCESS_PHRASE}`,
			},
			ERROR: {
				status: 'error',
				message: `${FIXED_ERROR_MESSAGE_PHRASE} updating profile`,
			},
			CUSTOM(status: Toast['status'], message: string) {
				return { status, message };
			},
		},
	},
} as const;

export default toastData;
