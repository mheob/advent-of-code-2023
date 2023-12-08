import { type Day } from '../types';

/**
 * Represents the current year.
 */
export const currentYear = new Date().getFullYear();

/**
 * Formats the given day value as a string with leading zeros.
 * @param day - The day value to format.
 * @returns The formatted day value as a string.
 */
export function formatDay(day: Day) {
	return String(day).padStart(2, '0');
}

/**
 * Formats the day name.
 * @param day The day to format.
 * @returns The formatted day name.
 */
export function formatDayName(day: Day) {
	return `day-${formatDay(day)}`;
}

/**
 * Generates a template for Advent of Code solutions.
 * @param day - The day of the Advent of Code challenge.
 * @returns The generated template.
 */
export function generateTemplate(day: Day) {
	return `import { parseLines, readInput } from '../utils/io';

const input = await readInput('${formatDayName(day)}');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	// TODO: add your code goes here
	return lines.length;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	// TODO: add your code goes here
	return lines.length;
}
`;
}

/**
 * Generates an array of numbers within a specified range.
 * @param start The starting number of the range.
 * @param stop The ending number of the range.
 * @param step The increment or decrement value. Default is 1.
 * @returns An array of numbers within the specified range.
 */
export function range(start: number, stop: number, step: number = 1): number[] {
	const result: number[] = [];
	for (let index = start; step > 0 ? index < stop : index > stop; index += step) {
		result.push(index);
	}
	return result;
}
