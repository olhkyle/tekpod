import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ShrinkMotionBlockProps {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

const ShrinkMotionBlock = ({ children, className, onClick, ...props }: ShrinkMotionBlockProps) => {
	return (
		<motion.div
			initial="rest"
			whileTap={{
				scale: 0.95,
				transition: { duration: 0.2 },
			}}
			className={className}
			onClick={onClick}
			{...props}>
			{children}
		</motion.div>
	);
};

export default ShrinkMotionBlock;
