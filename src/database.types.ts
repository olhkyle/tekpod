export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
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
					id?: never;
					user_id: string;
					title: string; // `not null` columns with no default must be supplied
					content: string; // nullable columns can be omitted
					feeling: string;
					updated_at: Date;
					tags: string[] | null;
				};
				Delete: {
					// the data to be passed to .delete()
					id?: never;
				};
			};
		};
	};
}
