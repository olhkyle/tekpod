import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { ShrinkMotionBlock } from '../components';
import { navigationLinks } from '../constants';

const HomePage = () => {
	return (
		<Container>
			<NavigationGrid>
				{navigationLinks.map(({ to, icon, title }) => (
					<Navigation to={to} key={to}>
						<ShrinkMotionBlock>
							<IconBackground>{icon}</IconBackground>
						</ShrinkMotionBlock>
						<span>{title}</span>
					</Navigation>
				))}
			</NavigationGrid>
		</Container>
	);
};

const Container = styled.section`
	width: 100%;
`;

const NavigationGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
`;

const Navigation = styled(Link)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--grey800);
	text-align: center;
`;

const IconBackground = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	min-width: 72px;
	min-height: 72px;
	background: linear-gradient(135deg, var(--grey200) 0%, var(--blue300) 50%, var(--blue200) 100%);
	border-radius: var(--radius-l);
`;

export default HomePage;
