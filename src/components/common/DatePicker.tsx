import { Dispatch, SetStateAction, useState } from 'react';
import styled from '@emotion/styled';
import { FieldError } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import { IoMdCalendar } from 'react-icons/io';
import { ko } from 'date-fns/locale';
import { Button } from '..';
import { customPropReceiver } from '../../constants';
import { format } from '../../utils/date';
import { useClickOutside } from '../../hooks';

interface DatePickerProps {
	selected: Date | undefined;
	setSelected: (date: Date) => void | Dispatch<SetStateAction<Date | undefined>>;
	error?: FieldError;
	disabled?: { after: Date };
	isFloated?: boolean;
}

const DatePicker = ({ selected, setSelected, error, disabled, isFloated = false, ...props }: DatePickerProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const targetRef = useClickOutside<HTMLDivElement>({ eventHandler: () => setIsOpen(false) });

	return (
		<Container ref={targetRef} isFloated={isFloated}>
			<TriggerButton type="button" $isDaySelected={selected ? true : false} onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
				<IconBackground>
					<IoMdCalendar size="24" color="var(--grey800)" />
				</IconBackground>
				<span>{selected ? format(selected) : 'Select Date'}</span>
			</TriggerButton>
			{error && <ErrorMessage>﹡ {error?.message}</ErrorMessage>}
			<DayPickerWrapper isFloated={isFloated}>
				{isOpen && (
					<DayPicker
						mode="single"
						locale={ko}
						required={true}
						selected={selected}
						disabled={disabled}
						onSelect={setSelected}
						captionLayout="dropdown"
						timeZone="Asia/Seoul"
						showOutsideDays
						onDayClick={() => {
							setIsOpen(false);
						}}
						{...props}
					/>
				)}
			</DayPickerWrapper>
		</Container>
	);
};

const Container = styled.div<{ isFloated: boolean }>`
	position: ${({ isFloated }) => (isFloated ? 'relative' : 'static')};
	display: inline-flex;
	flex-direction: column;
	gap: 4px;
`;

const TriggerButton = styled(Button, customPropReceiver)<{ $isDaySelected: boolean; $isOpen: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: calc(var(--padding-container-mobile) * 0.75) var(--padding-container-mobile);

	color: ${({ $isDaySelected }) => ($isDaySelected ? 'var(--grey900)' : 'var(--grey500)')};
	background-color: ${({ $isOpen }) => ($isOpen ? 'var(--white)' : 'var(--greyOpacity50)')};
	border: ${({ $isOpen }) => `1px solid ${$isOpen ? 'var(--grey300)' : 'var(--grey100)'}`};
	border-radius: var(--radius-m);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	transition: background 0.15s ease-in-out;
`;

const IconBackground = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 4px;
	background-color: var(--grey100);
	border-radius: var(--radius-m);
`;

const ErrorMessage = styled.p`
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
`;

const DayPickerWrapper = styled.div<{ isFloated: boolean }>`
	position: ${({ isFloated }) => (isFloated ? 'absolute' : 'static')};
	top: ${({ isFloated }) => (isFloated ? '64px' : '0')};
`;

export default DatePicker;
