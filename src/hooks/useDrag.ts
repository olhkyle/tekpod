import { TouchEvent, useRef, useState } from 'react';
import { useClickOutside } from '.';

const DRAG_THRESHOLD = 10; // pixel

const useDrag = () => {
	const [dragX, setDragX] = useState(0);
	const [dragStartX, setDragStartX] = useState<number | null>(null);
	const dragRef = useRef<number>(0);

	const dragContainerRef = useClickOutside<HTMLLIElement>({
		eventHandler: () => {
			setDragX(0);
			dragRef.current = 0;
		},
	});

	const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		setDragStartX(event.touches[0].clientX);
		dragRef.current = event.touches[0].clientX;
	};

	const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
		if (dragStartX === null) return;

		const currentX = event.touches[0].clientX;
		const diff = currentX - dragRef.current; // current position - the first touch-drag starting position(negative)

		// Apply drag only when the minimum movement distance is exceeded
		if (Math.abs(diff) > DRAG_THRESHOLD) {
			const dampingFactor = 0.8;
			const dragAmount = currentX - dragRef.current;
			if (dragAmount < 0) {
				setDragX(Math.max(dampingFactor * dragAmount, -80));
			}
		}
	};

	const handleTouchEnd = () => {
		const SNAP_THRESHOLD = -40;

		if (dragX < SNAP_THRESHOLD) {
			setDragX(-80);
		} else {
			setDragX(0);
		}

		setDragStartX(null);
		dragRef.current = 0;
	};

	return {
		dragX,
		dragContainerRef,
		handlers: { handleTouchStart, handleTouchMove, handleTouchEnd },
	};
};

export default useDrag;
