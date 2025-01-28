import { ReactNode } from 'react';

interface FlexProps {
	flex?: `${number} ${number} ${number}`;
	direction?: 'row' | 'column';
	justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
	alignItems?: 'flex-start' | 'center' | 'flex-end';
	gap?: `${number}px`;
	margin?:
		| `${number}px ${number}px ${number}px ${number}px`
		| `${number}px ${number}px ${number}px`
		| `${number}px ${number}px`
		| `${number}px`
		| `${number}rem ${number}rem`
		| `${number}rem`;
	padding?:
		| `${number}px ${number}px ${number}px ${number}px`
		| `${number}px ${number}px ${number}px`
		| `${number}px ${number}px`
		| `${number}px`
		| `${number}rem ${number}rem`
		| `${number}rem`;
	width?: `${number}%` | `${number}px` | 'auto';
	children: ReactNode;
}

const Flex = ({
	flex = '1 1 0',
	direction = 'row',
	justifyContent = 'flex-start',
	alignItems = 'center',
	gap = '0px',
	margin = '0px 0px',
	padding = '0px 0px',
	width = 'auto',
	children,
}: FlexProps) => {
	return (
		<div css={{ display: 'flex', flex, flexDirection: direction, justifyContent, alignItems, gap, margin, padding, width }}>{children}</div>
	);
};

export default Flex;
