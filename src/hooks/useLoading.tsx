import { useRef, useState } from 'react';
import { useIsMountedRef } from '.';
import { LoadingSpinner } from '../components';

const useLoading = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const ref = useIsMountedRef();
	const abortControllerRef = useRef<AbortController | null>(null);

	//  "In TypeScript's generic functions, when using async and the generic type <T> together, the generic type's position might be recognized as a JSX tag, so you write it as <T,>
	const startTransition = async <T,>(promise: Promise<T>): Promise<T> => {
		abortControllerRef.current?.abort(); // cancel previous Request
		abortControllerRef.current = new AbortController();

		try {
			setLoading(true);

			const data = await promise;
			return data;
		} finally {
			if (ref.isMounted) {
				setLoading(false);
			}
			abortControllerRef.current = null;
		}
	};

	const cancel = () => {
		abortControllerRef.current?.abort();
	};

	return { Loading: <LoadingSpinner />, isLoading: loading, startTransition, cancel };
};

export default useLoading;
