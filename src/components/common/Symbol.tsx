import { ReactNode } from 'react';

interface SymbolProps {
	children: ReactNode;
}

const Symbol = ({ children }: SymbolProps) => {
	return (
		<span
			css={{
				fontSize: '1.2em',
			}}>
			{children}
		</span>
	);
};

export default Symbol;
