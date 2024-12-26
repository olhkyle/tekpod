import { useId, useState } from 'react';
import styled from '@emotion/styled';
import { FieldError } from 'react-hook-form';
import { BiSolidChevronRight } from 'react-icons/bi';
import { Button } from '.';
import type { FinancialLedger, RestrictedRecipeForValidation } from '../../supabase/schema';
import { customPropReceiver } from '../../constants';
import { PaymentDataType } from '../../constants/financialLedger';
import { FilmRecipeFieldDataType } from '../../constants/recipes';

export type CustomSelectDataType = PaymentDataType | FilmRecipeFieldDataType[number] | string | number;

interface CustomSelectProps<T extends CustomSelectDataType> {
	data: readonly T[];
	target_id: keyof RestrictedRecipeForValidation | keyof FinancialLedger;
	placeholder: string;
	currentValue: T;
	isTriggered: boolean;
	error?: FieldError;
	onSelect: (option: T) => void;
}

const CustomSelect = <T extends CustomSelectDataType>({
	data: options,
	target_id,
	placeholder,
	currentValue,
	isTriggered,
	error,
	onSelect,
}: CustomSelectProps<T>) => {
	const generatedId = useId();
	const [isOpen, setOpen] = useState(false);

	return (
		<div>
			<SelectTrigger
				type="button"
				onClick={() => setOpen(!isOpen)}
				tabIndex={0}
				aria-autocomplete="none"
				aria-controls={`custom-select-${generatedId}`}
				aria-expanded={isOpen}>
				<SelectValue isTriggered={isTriggered}>{isTriggered ? options.find(option => option === currentValue) : placeholder}</SelectValue>
				<Chevron size="21" color="var(--black)" $isOpen={isOpen} />
			</SelectTrigger>
			{error && <ErrorMessage>{error?.message}</ErrorMessage>}

			<SelectContent isOpen={isOpen} aria-labelledby={`custom-select-${generatedId}-content`}>
				<Label htmlFor={target_id}>{target_id.toUpperCase()}</Label>
				{options.map((option, idx) => (
					<SelectItem
						key={`${option}_${idx}`}
						isCurrent={option === currentValue}
						tabIndex={0}
						onClick={() => {
							onSelect(option);
							setOpen(false);
						}}
						data-selected={option === currentValue}>
						<SelectItemCheckIndicator isCurrent={option === currentValue} />
						<span>{option}</span>
					</SelectItem>
				))}
			</SelectContent>
		</div>
	);
};

const SelectTrigger = styled(Button)`
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

const ErrorMessage = styled.p`
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
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
	font-weight: var(--fw-bold);
	color: var(--grey900);
`;

const SelectItem = styled.div<{ isCurrent: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	font-size: var(--fz-h6);
	font-weight: ${({ isCurrent }) => (isCurrent ? 'var(--fw-semibold)' : 'var(--fw-regular)')};
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
