type StatusOption = (typeof status)[number];

const status = ['present', 'absent', 'remote', 'half_day'] as const;

export type { StatusOption };
export { status };
