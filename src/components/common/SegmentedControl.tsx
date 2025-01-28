import { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';

interface SegmentedControlProps<T extends string> {
	options: readonly T[];
	current: string;
	setCurrent: Dispatch<SetStateAction<T>>;
}

const SegmentedControl = <T extends string>({ options, current, setCurrent }: SegmentedControlProps<T>) => {
	return (
		<Container>
			{options.map(option => (
				<Control key={option} isCurrent={current === option} onClick={() => setCurrent(option)}>
					{option}
				</Control>
			))}
		</Container>
	);
};

const Container = styled.ul`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 6px;
	padding: calc(var(--padding-container-mobile) * 0.35);
	background-color: var(--grey50);
	border-radius: var(--radius-s);
`;

const Control = styled.li<{ isCurrent: boolean }>`
	min-width: 50px;
	padding: calc(var(--padding-container-mobile) * 0.25);
	background: ${({ isCurrent }) => (isCurrent ? 'var(--black)' : 'var(--grey100)')};
	color: ${({ isCurrent }) => (isCurrent ? 'var(--white)' : 'var(--grey800)')};
	font-weight: ${({ isCurrent }) => (isCurrent ? 'var(--fw-semibold)' : 'var(--fw-regular)')};
	border: 1px solid var(--grey200);
	border-radius: var(--radius-s);
	text-align: center;
	cursor: pointer;
`;

export default SegmentedControl;
