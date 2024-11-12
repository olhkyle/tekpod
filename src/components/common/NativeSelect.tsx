import styled from '@emotion/styled';
import { Dispatch, SetStateAction } from 'react';
import {
	dynamicRange,
	filmSimulation,
	grainEffect,
	highlight,
	noiseReduction,
	shadow,
	color,
	sharpness,
	sensors,
} from '../../constants/recipes';
import { RestrictedRecipe } from '../../supabase/schema';

interface NativeSelectProps {
	data:
		| typeof filmSimulation
		| typeof dynamicRange
		| typeof grainEffect
		| typeof highlight
		| typeof shadow
		| typeof color
		| typeof sharpness
		| typeof noiseReduction
		| typeof sensors;

	target_id: keyof Omit<RestrictedRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
	current: Omit<RestrictedRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
	setCurrent: Dispatch<SetStateAction<Omit<RestrictedRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>>>;
}

const NativeSelect = ({ data, target_id, current, setCurrent }: NativeSelectProps) => {
	console.log(current);
	console.log(data);
	return (
		<SelectOptionWithLabel>
			<label htmlFor={target_id}>{target_id}</label>
			<select id={target_id} value={current[target_id]} onChange={e => setCurrent({ ...current, [target_id]: e.target.value })}>
				{data.map((value, idx) => (
					<option key={`${idx}_${value}`} value={value}>
						{value}
					</option>
				))}
			</select>
		</SelectOptionWithLabel>
	);
};

const SelectOptionWithLabel = styled.div`
	label {
		display: none;
	}

	select {
		padding: var(--padding-container-mobile);
		width: 100%;
		font-size: var(--fz-h5);
		color: var(--black);
		background-color: var(--white);
		border-bottom: 1px solid var(--greyOpacity100);
		border-radius: none;
		cursor: pointer;
	}
`;

export default NativeSelect;
