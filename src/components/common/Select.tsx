import { useId, useState } from 'react';
import styled from '@emotion/styled';
import { BiSolidChevronRight } from 'react-icons/bi';
import { FieldError } from 'react-hook-form';
import { customPropReceiver } from '../../constants';
import Button from './Button';
import { useClickOutside } from '../../hooks';

interface SelectProps<T extends string> {
	data: readonly T[];
	placeholder: string;
	descriptionLabel?: string;
	currentValue: T;
	error?: FieldError;
	onSelect: (option: T) => void;
}

const Select = <T extends string>({ data: options, placeholder, descriptionLabel, currentValue, error, onSelect }: SelectProps<T>) => {
	const generatedId = useId();
	const [isOpen, setOpen] = useState(false);

	const targetRef = useClickOutside<HTMLDivElement>({ eventHandler: () => setOpen(false) });

	return (
		<SelectRoot ref={targetRef}>
			<SelectTrigger
				type="button"
				role="combobox"
				onClick={() => setOpen(!isOpen)}
				tabIndex={0}
				aria-controls={`select-${generatedId}`}
				aria-expanded={isOpen}>
				<span>{currentValue ?? placeholder}</span>
				<Chevron size="19" color="var(--black)" $isOpen={isOpen} />
			</SelectTrigger>
			{error && <ErrorMessage>﹡ {error?.message}</ErrorMessage>}
			<SelectContent isOpen={isOpen} aria-labelledby={`select-${generatedId}-content`}>
				{descriptionLabel && <SelectDescriptionLabel>{descriptionLabel}</SelectDescriptionLabel>}
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
		</SelectRoot>
	);
};

const SelectRoot = styled.div`
	position: relative;
`;

const SelectTrigger = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	background-color: var(--grey50);
	font-size: var(--fz-p);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);

	span {
		color: var(--black);
	}
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
	position: absolute;
	top: 40px;
	right: 0;
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	flex-direction: column;
	padding: calc(var(--padding-container-mobile) * 0.5);
	height: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
	background-color: var(--white);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);
	transition: height 0.3s ease-in-out display 0.5s ease-in-out;
`;

const SelectDescriptionLabel = styled.span`
	color: var(--black);
	font-weight: var(--fw-medium);
`;

const SelectItem = styled.div<{ isCurrent: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.5);
	font-size: var(--fz-p);
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

export default Select;
