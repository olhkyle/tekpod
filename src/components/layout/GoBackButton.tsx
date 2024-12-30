import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine } from 'react-icons/ri';
import { Button } from '../common';

interface GoBackButtonProps {
	children?: ReactNode;
}

const GoBackButton = ({ children = <RiArrowLeftLine size="24" color="var(--grey500)" /> }: GoBackButtonProps) => {
	const navigate = useNavigate();

	return (
		<StyledMotion
			initial="rest"
			whileTap={{
				scale: 0.95,
				transition: { duration: 0.2 },
			}}>
			<StyledButton type="button" onClick={() => navigate(-1)}>
				{children}
			</StyledButton>
		</StyledMotion>
	);
};

const StyledMotion = styled(motion.div)`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StyledButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	min-width: 32px;
	min-height: 32px;
	background-color: var(--greyOpacity50);
	border: 1px solid var(--greyOpacity200);
	border-radius: var(--radius-s);

	&:hover {
		background-color: var(--greyOpacity100);
	}
`;

export default GoBackButton;
