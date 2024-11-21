const filmSimulation = ['Provia', 'Velvia', 'Astia', 'Classic Chrome', 'PRO Neg. Hi', 'PRO Neg. Std', 'Acros'] as const;

const dynamicRange = ['DR-Auto', 'DR-200', 'DR-400'] as const;

const grainEffect = ['Strong', 'Weak', 'Off'] as const;

const numberRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;
const highlight = [...numberRange] as const;
const shadow = [...numberRange] as const;
const color = [...numberRange] as const;
const sharpness = [...numberRange] as const;
const noiseReduction = [...numberRange] as const;
const sensors = ['X-Trans I', 'X-Trans II', 'X-Trans III', 'X-Trans IV', 'X-Trans V'] as const;

export { filmSimulation, dynamicRange, grainEffect, highlight, shadow, color, sharpness, noiseReduction, sensors };
