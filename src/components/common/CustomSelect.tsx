import styled from '@emotion/styled';
import { Dispatch, SetStateAction, useState } from 'react';
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
import type { RestrictedRecipeForValidation } from '../../supabase/schema';
import { BiSolidChevronRight } from 'react-icons/bi';
import { customPropReceiver } from '../../constants';

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
	target_id: keyof RestrictedRecipeForValidation;
	current: RestrictedRecipeForValidation;
	setCurrent: Dispatch<SetStateAction<RestrictedRecipeForValidation>>;
	isTriggered: { [key: string]: boolean };
	setTriggered: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

const CustomSelect = ({ data: options, target_id, current, setCurrent, isTriggered, setTriggered }: NativeSelectProps) => {
	const [isOpen, setOpen] = useState(false);

	const PLACEHOLDER_PHRASE = `Select ${target_id.toUpperCase()}`;

	return (
		<CustomSelectWithLabel>
			<SelectTrigger type="button" onClick={() => setOpen(!isOpen)} aria-autocomplete="none" aria-expanded={isOpen}>
				<SelectValue isTriggered={isTriggered[target_id]}>
					{isTriggered[target_id] ? options.find(option => option === current[target_id]) : PLACEHOLDER_PHRASE}
				</SelectValue>
				<Chevron size="21" color="var(--black)" $isOpen={isOpen} />
			</SelectTrigger>

			<SelectContent isOpen={isOpen}>
				<Label htmlFor={target_id}>{target_id.toUpperCase()}</Label>
				{options.map((option, idx) => (
					<SelectItem
						key={`${option}_${idx}`}
						isCurrent={option === current[target_id]}
						onClick={() => {
							setCurrent({ ...current, [target_id]: option });
							setOpen(false);
							setTriggered({ ...isTriggered, [target_id]: true });
						}}>
						<SelectItemCheckIndicator isCurrent={option === current[target_id]} />
						<span>{option}</span>
					</SelectItem>
				))}
			</SelectContent>
		</CustomSelectWithLabel>
	);
};

const CustomSelectWithLabel = styled.div``;

const SelectTrigger = styled.button`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--white);
	border-bottom: 1px solid var(--greyOpacity100);
	border-radius: none;
	cursor: pointer;

	&:focus {
		border-bottom-color: var(--black);
	}
`;

const SelectValue = styled.span<{ isTriggered: boolean }>`
	font-size: var(--fz-h5);
	color: ${({ isTriggered }) => (isTriggered ? 'var(--black)' : 'var(--grey400)')};
`;

const Chevron = styled(BiSolidChevronRight, customPropReceiver)<{ $isOpen: boolean }>`
	transform: ${({ $isOpen }) => ($isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
	transition: transform 0.15s ease-in-out;
`;

const SelectContent = styled.div<{ isOpen: boolean }>`
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	flex-direction: column;
	padding: var(--padding-container-mobile);
	height: ${({ isOpen }) => (isOpen ? '100%' : '0')};
	transition: height 0.3s ease-in-out display 0.5s ease-in-out;
	border: 1px solid var(--black);
`;

const Label = styled.label`
	display: block;
	margin-bottom: 8px;
	font-weight: var(--fw-semibold);
	color: var(--grey900);
`;

const SelectItem = styled.div<{ isCurrent: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	font-size: var(--fz-h6);
	color: ${({ isCurrent }) => (isCurrent ? 'var(--grey900)' : 'var(--grey700)')};
	background-color: ${({ isCurrent }) => (isCurrent ? 'var(--greyOpacity50)' : 'var(--white)')};
	border-radius: var(--radius-s);
	cursor: pointer;

	&:hover {
		background-color: var(--greyOpacity100);
	}
`;

const SelectItemCheckIndicator = styled.span<{ isCurrent: boolean }>`
	display: inline-block;
	width: 12px;
	height: 12px;
	background-color: ${({ isCurrent }) => (isCurrent ? 'var(--black)' : 'var(--white)')};
	border: 1px solid var(--grey200);
	border-radius: var(--radius-extra);
`;

export default CustomSelect;
