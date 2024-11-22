/**
 * FilmRecipe Data Example
 * 
 * const recipe: RestrictedRecipe = {
	id: '1',
	user_id: '1',
	title: 'string',
	film_simulation: 'string',
	dynamic_range: 'DR-Auto',
	grain_effect: 'string',
	wb: 'Daylight, +3 Red & -5 Blue',
	highlight: +1,
	shadow: -1,
	color: +2,
	sharpness: +2,
	noise_reduction: -1,
	iso: 'up to ISO 6400',
	exposure_compensation: '+1/3 to +1',
	sensors: 'string',
	created_at: new Date(),
	updated_at: new Date(),
};
 */

import { v4 as uuid } from 'uuid';
import { RestrictedRecipe } from './schema';
import supabase from './service';

const TABLE = 'recipes';

const getRecipes = async (): Promise<RestrictedRecipe[]> => {
	const { data, error } = await supabase.from(TABLE).select('*').order('updated_at', { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addRecipe = async ({ data, imageFile }: { data: Omit<RestrictedRecipe, 'id' | 'imgSrc'>; imageFile: File }) => {
	// 'id' field will be generated in auto
	const { data: uploadImage, error: uploadError } = await supabase.storage.from('recipe').upload(`film/${uuid()}`, imageFile, {
		cacheControl: '3600',
		upsert: false,
	});

	const { error: addRecipeError } = await supabase
		.from(TABLE)
		.insert({
			...data,
			imgSrc: `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/${import.meta.env.VITE_SUPABASE_FILMRECIPE_URL}/${uploadImage?.path}`,
		})
		.select();

	if (uploadError) {
		console.log('here');
		throw { error: uploadError, message: 'Error to upload on image storage happens' };
	}

	if (addRecipeError) {
		throw { error: addRecipeError, message: 'Error to add recipe happens' };
	}
};

const removeRecipe = async ({ id, path }: { id: string; path: string }) => {
	const [removeFilmRecipeImage, removeFilmRecipe] = await Promise.all([
		supabase.storage.from('recipe').remove([`${path}.webp`]),
		supabase.from(TABLE).delete().eq('id', id),
	]);

	if (removeFilmRecipeImage?.error) {
		throw { error: removeFilmRecipeImage?.error, message: 'Error to delete this recipe image' };
	}

	if (removeFilmRecipe?.error) {
		throw { error: removeFilmRecipe?.error, message: 'Error to delete this recipe' };
	}
};

export { getRecipes, addRecipe, removeRecipe };
