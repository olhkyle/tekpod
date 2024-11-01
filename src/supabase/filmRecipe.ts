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

export { getRecipes };
