export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					// the data expected from .select()
					user_id: string;
					email: string;
					nickname: string;
				};
				Insert: {
					user_id: string;
					email: string;
					nickname: string;
				};
				Update: {
					user_id: string;
					email: string;
					nickname: string;
				};
				Delete: {
					user_id: string;
					email: string;
				};
			};
			diary: {
				Row: {
					// the data expected from .select()
					id: string;
					user_id: string;
					title: string;
					content: string;
					feeling: string;
					created_at: Date;
					updated_at: Date;
					tags: string[] | null;
				};
				Insert: {
					// the data to be passed to .insert()
					id?: never; // generated columns must not be supplied
					user_id: string;
					title: string; // `not null` columns with no default must be supplied
					content: string; // nullable columns can be omitted
					feeling: string;
					created_at: Date;
					updated_at: Date;
					tags: string[] | null;
				};
				Update: {
					// the data to be passed to .update()
					id: never;
					user_id: string;
					title?: string; // `not null` columns with no default must be supplied
					content?: string; // nullable columns can be omitted
					feeling?: string;
					updated_at: Date;
					tags?: string[] | null;
				};
				Delete: {
					// the data to be passed to .delete()
					id: never;
				};
			};
			recipes: {
				Row: {
					// the data expected from .select()
					id: string;
					user_id: string;
					title: string;
					film_simulation: string;
					dynamic_range: string;
					grain_effect: string;
					wb: string;
					highlight: number;
					shadow: number;
					color: number;
					sharpness: number;
					noise_reduction: number;
					iso: string;
					exposure_compensation: string;
					sensors: string;
					primary: boolean;
					created_at: Date;
					updated_at: Date;
					imgSrc: string;
				};
				Insert: {
					// the data to be passed to .insert()
					id?: never; // generated columns must not be supplied
					user_id: string;
					title: string;
					film_simulation: string; // nullable columns can be omitted
					dynamic_range: string;
					grain_effect: string;
					wb: string;
					highlight: number;
					shadow: number;
					color: number;
					sharpness: number;
					noise_reduction: number;
					iso: string;
					exposure_compensation: string;
					sensors: string;
					primary: boolean;
					created_at: Date;
					updated_at: Date;
					imgSrc: string;
				};
				Update: {
					// the data to be passed to .update()
					id: never; // generated columns must not be supplied
					user_id: string;
					title: string;
					film_simulation?: string;
					dynamic_range?: string;
					grain_effect?: string;
					wb?: string;
					highlight?: number;
					shadow?: number;
					color?: number;
					sharpness?: number;
					noise_reduction?: number;
					iso?: string;
					exposure_compensation?: string;
					sensors?: string;
					primary?: boolean;
					updated_at: Date;
					imgSrc: string;
				};
				Delete: {
					// the data to be passed to .delete()
					id: never;
				};
			};
			todos: {
				Row: {
					// the data expected from .select()
					id: string;
					user_id: string;
					completed: boolean;
					content: string;
					created_at: Date;
					updated_at: Date;
				};
				Insert: {
					// the data to be passed to .insert()
					id?: never; // generated columns must not be supplied
					user_id: string;
					completed: boolean;
					content: string;
					created_at: Date;
					updated_at: Date;
				};
				Update: {
					// the data to be passed to .update()
					id: never;
					user_id: string;
					completed?: boolean;
					content?: string;
					created_at?: Date;
					updated_at: Date;
				};
				Delete: {
					// the data to be passed to .delete()
					id: never;
				};
			};
			expense_tracker: {
				Row: {
					// the data expected from .select()
					id: string;
					user_id: string;
					place: string;
					priceIntegerPart: string;
					priceDecimalPart: string;
					price_unit: string;
					payment_method: string;
					bank: string;
					usage_date: Date;
					created_at: Date;
					updated_at: Date;
				};
				Insert: {
					// the data to be passed to .insert()
					id?: never; // generated columns must not be supplied
					user_id: string;
					place: string;
					priceIntegerPart: string;
					priceDecimalPart: string;
					price_unit: string;
					payment_method: string;
					bank?: string;
					usage_date: Date;
					created_at: Date;
					updated_at: Date;
				};
				Update: {
					// the data to be passed to .update()
					id: never;
					user_id: string;
					place?: string;
					priceIntegerPart?: string;
					priceDecimalPart?: string;
					price_unit?: string;
					payment_method?: string;
					bank?: string;
					usage_date?: Date;
					created_at?: Date;
					updated_at?: Date;
				};
				Delete: {
					// the data to be passed to .delete()
					id: never;
				};
			};
		};
	};
}
