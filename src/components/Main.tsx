import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

interface MainProps {
	children: ReactNode;
}

const Main = ({ children }: MainProps) => {
	return <Container>{children}</Container>;
};

const Container = styled.main`
	margin: 60px auto;
	padding: 0 1rem;
	width: 100%;
	height: 100%;
`;

export default Main;
