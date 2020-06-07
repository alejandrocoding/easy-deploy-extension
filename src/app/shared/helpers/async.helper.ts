export const sleep = (ms: number) => new Promise((cb: () => void) => setTimeout(cb, ms));
