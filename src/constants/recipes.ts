type FilmRecipeFieldDataType = Extract<(typeof FILM_RECIPE_FORM.FIELDS)[number], { type: 'select' }>['data'];
type RecipeValueRange = (typeof valueRange)[number];

const DEFAULT_IMAGE_SIZE = 10 * 1024 * 1024;

const valueRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;

const filmRecipeFieldData = {
	title: '',
	filmSimulation: ['Provia', 'Velvia', 'Astia', 'Classic Chrome', 'PRO Neg. Hi', 'PRO Neg. Std', 'Acros'] as const,
	dynamicRange: ['DR-Auto', 'DR-200', 'DR-400'] as const,
	grainEffect: ['Strong', 'Weak', 'Off'] as const,
	wb: 'Auto, 0 Red & 0 Blue' as const,
	highlight: [...valueRange] as const,
	shadow: [...valueRange] as const,
	color: [...valueRange] as const,
	sharpness: [...valueRange] as const,
	noiseReduction: [...valueRange] as const,
	iso: 'up to ISO 6400' as const,
	exposure_compensation: '0 to +1' as const,
	sensors: ['X-Trans I', 'X-Trans II', 'X-Trans III', 'X-Trans IV', 'X-Trans V'] as const,
} as const;

const FILM_RECIPE_FORM = {
	IMAGE: {
		MAX_SIZE: DEFAULT_IMAGE_SIZE,
		ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
	},
	FIELDS: [
		{ type: 'input', data: filmRecipeFieldData.title, target_id: 'title', placeholder: 'Recipe Title' },
		{ type: 'select', data: filmRecipeFieldData.filmSimulation, target_id: 'film_simulation', placeholder: 'Select Film Simulation' },
		{ type: 'select', data: filmRecipeFieldData.dynamicRange, target_id: 'dynamic_range', placeholder: 'Select Dynamic Range' },
		{ type: 'select', data: filmRecipeFieldData.grainEffect, target_id: 'grain_effect', placeholder: 'Select Grain Effect' },
		{ type: 'input', data: filmRecipeFieldData.wb, target_id: 'wb', placeholder: 'White Balance(Auto, +1 Red & +1 Blue)' },
		{ type: 'select', data: filmRecipeFieldData.highlight, target_id: 'highlight', placeholder: 'Select Highlight' },
		{ type: 'select', data: filmRecipeFieldData.shadow, target_id: 'shadow', placeholder: 'Select Shadow' },
		{ type: 'select', data: filmRecipeFieldData.color, target_id: 'color', placeholder: 'Select Color' },
		{ type: 'select', data: filmRecipeFieldData.sharpness, target_id: 'sharpness', placeholder: 'Select Sharpness' },
		{ type: 'select', data: filmRecipeFieldData.noiseReduction, target_id: 'noise_reduction', placeholder: 'Select Noise Reduction' },
		{ type: 'input', data: filmRecipeFieldData.iso, target_id: 'iso', placeholder: 'up to ISO 6400' },
		{
			type: 'input',
			data: filmRecipeFieldData.exposure_compensation,
			target_id: 'exposure_compensation',
			placeholder: 'Exposure Compensation',
		},
		{ type: 'select', data: filmRecipeFieldData.sensors, target_id: 'sensors', placeholder: 'Select Sensors' },
	] as const,
} as const;

export type { FilmRecipeFieldDataType, RecipeValueRange };
export { filmRecipeFieldData, FILM_RECIPE_FORM };
