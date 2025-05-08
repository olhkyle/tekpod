type Handlers = {
	[handler: string]: () => void;
};

type OldData<T> = { pageParams: number[]; pages: T[][] };

export type { Handlers, OldData };
