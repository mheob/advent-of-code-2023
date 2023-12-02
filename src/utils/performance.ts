/**
 * Rounds a number to two decimal places.
 * @param x - The number to round.
 * @returns The rounded number.
 */
function round(x: number) {
	return Math.round((x + Number.EPSILON) * 100) / 100;
}

/**
 * Formats the performance time in either microseconds or milliseconds.
 * @param time - The performance time in seconds.
 * @returns The formatted performance time with the appropriate unit (µs or ms).
 */
export function formatPerformance(time: number) {
	if (time < 1) {
		return `${round(time * 1000)} µs`;
	}
	return `${round(time)} ms`;
}

/**
 * Measures the performance of a given function.
 * @param handler - The function to be executed and measured.
 * @returns A tuple containing the result of the function and the elapsed time in milliseconds.
 * @template T - The type of the result returned by the function.
 */
export async function withPerformance<T>(handler: () => T) {
	const start = performance.now();
	const result = await handler();
	const end = performance.now();

	return [result, end - start] as const;
}
