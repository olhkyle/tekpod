import { ReactNode } from 'react';

interface DescriptionProps {
	children: ReactNode;
}

const Description = ({ children }: DescriptionProps) => {
	return (
		<p
			css={{
				padding: 'calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75)',
				fontWeight: 'var(--fw-medium)',
				color: 'var(--blue200)',
				backgroundColor: 'var(--blue100)',
				borderRadius: 'var(--radius-s)',
			}}>
			{children}
		</p>
	);
};

export default Description;
