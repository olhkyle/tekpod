import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ShrinkMotionBlockProps {
	children: ReactNode;
	className?: string;
}

const ShrinkMotionBlock = ({ children, className, ...props }: ShrinkMotionBlockProps) => {
	return (
		<motion.div
			className={className}
			initial="rest"
			whileTap={{
				scale: 0.95,
				transition: { duration: 0.2 },
			}}
			{...props}>
			{children}
		</motion.div>
	);
};

export default ShrinkMotionBlock;
