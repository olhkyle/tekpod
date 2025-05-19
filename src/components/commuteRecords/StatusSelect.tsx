import styled from '@emotion/styled';
import { FieldError } from 'react-hook-form';

interface StatusSelectProps<T extends string> {
	data: readonly T[];
	currentValue: T;
	error?: FieldError;
	onSelect: (option: T) => void;
}

const StatusSelect = <T extends string>({ data, currentValue, error, onSelect }: StatusSelectProps<T>) => {
	return (
		<Container role="combobox">
			<Label>Status</Label>
			<Options>
				{data.map(option => (
					<Option key={option} isCurrent={option === currentValue} tabIndex={0} onClick={() => onSelect(option)}>
						<CheckIndicator isChecked={option === currentValue} />
						<span>{option}</span>
					</Option>
				))}
			</Options>
			{error && (
				<ErrorMessage>
					<Symbol>﹡</Symbol> {error?.message}
				</ErrorMessage>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const Label = styled.p`
	font-weight: var(--fw-semibold);
`;

const Options = styled.ul`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 4px;
`;

const Option = styled.li<{ isCurrent: boolean }>`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: calc(var(--padding-container-mobile) * 0.5);
	background-color: ${({ isCurrent }) => (isCurrent ? 'var(--grey100)' : 'var(--white)')};
	border-radius: var(--radius-s);
	font-weight: ${({ isCurrent }) => (isCurrent ? 'var(--fw-bold)' : 'var(--fw-regular)')};
	transition: background-color 0.15s ease-in-out, font-weight 0.15s ease-in-out;

	&:hover,
	&:focus {
		background-color: var(--grey100);
	}
`;

const CheckIndicator = styled.span<{ isChecked: boolean }>`
	display: inline-block;
	width: 12px;
	height: 12px;
	border: 1px solid var(--grey200);
	border-radius: var(--radius-extra);
	background-color: ${({ isChecked }) => (isChecked ? 'var(--black)' : 'var(--white)')};
	transition: background-color 0.15s ease-in-out;
`;

const ErrorMessage = styled.p`
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
`;

const Symbol = styled.span`
	font-size: 1.2em;
`;

export default StatusSelect;
