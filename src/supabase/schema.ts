import { Database } from './database.types';

type ServiceDataType = Diary | Recipe | null;

type Diary = Database['public']['Tables']['diary']['Row'];
type Recipe = Database['public']['Tables']['recipes']['Row'];

interface RestrictedRecipe extends Recipe {
	dynamic_range: 'DR-Auto' | `DR-${'number'}`;
	wb: `${string}, ${number} Red & ${number} Blue`;
	iso: `up to ISO ${number}`;
	exposure_compensation: `${string} to ${string}` | '0';
}

interface RestricedRecipeWithImage extends RestrictedRecipe {
	imgSrc: string;
}

type RestrictedRecipeForValidation = Omit<RestrictedRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
type RestrictedRecipeForValidatioWithImage = Omit<RestricedRecipeWithImage, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type {
	ServiceDataType,
	Diary,
	RestrictedRecipe,
	RestricedRecipeWithImage,
	RestrictedRecipeForValidation,
	RestrictedRecipeForValidatioWithImage,
};
