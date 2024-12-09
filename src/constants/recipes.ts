type FieldDataType = Extract<(typeof FILM_RECIPE_FORM.FIELDS)[number], { type: 'select' }>['data'];

const PLACEHOLDER_IMAGE_URL = '/placeholder-gray.webp';

const DEFAULT_IMAGE_SIZE = 10 * 1024 * 1024;

const valueRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;

const fieldData = {
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
		{ type: 'input', data: fieldData.title, target_id: 'title', placeholder: 'Recipe Title' },
		{ type: 'select', data: fieldData.filmSimulation, target_id: 'film_simulation', placeholder: 'Select Film Simulation' },
		{ type: 'select', data: fieldData.dynamicRange, target_id: 'dynamic_range', placeholder: 'Select Dynamic Range' },
		{ type: 'select', data: fieldData.grainEffect, target_id: 'grain_effect', placeholder: 'Select Grain Effect' },
		{ type: 'input', data: fieldData.wb, target_id: 'wb', placeholder: 'White Balance(Auto, +1 Red & +1 Blue)' },
		{ type: 'select', data: fieldData.highlight, target_id: 'highlight', placeholder: 'Select Highlight' },
		{ type: 'select', data: fieldData.shadow, target_id: 'shadow', placeholder: 'Select Shadow' },
		{ type: 'select', data: fieldData.color, target_id: 'color', placeholder: 'Select Color' },
		{ type: 'select', data: fieldData.sharpness, target_id: 'sharpness', placeholder: 'Select Sharpness' },
		{ type: 'select', data: fieldData.noiseReduction, target_id: 'noise_reduction', placeholder: 'Select Noise Reduction' },
		{ type: 'input', data: fieldData.iso, target_id: 'iso', placeholder: 'up to ISO 6400' },
		{
			type: 'input',
			data: fieldData.exposure_compensation,
			target_id: 'exposure_compensation',
			placeholder: 'Exposure Compensation',
		},
		{ type: 'select', data: fieldData.sensors, target_id: 'sensors', placeholder: 'Select Sensors' },
	] as const,
} as const;

export type { FieldDataType };
export { PLACEHOLDER_IMAGE_URL, fieldData, FILM_RECIPE_FORM };
