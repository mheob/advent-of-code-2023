import { key, sum } from '../utils/common';
import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-12');

/**
 * Takes an array of strings as input and returns an array of objects.
 * Each object in the output array contains two properties: `text` and `numbers`.
 * The `text` property is the first element of each string in the input array,
 * and the `numbers` property is an array of numbers obtained by splitting the second element
 * of each string in the input array by commas and converting them to numbers.
 *
 * @param linesFromInput - An array of strings where each string contains two elements separated by a space.
 *                         The first element is a text and the second element is a comma-separated list of numbers.
 * @returns An array of objects, where each object has a `text` property and a `numbers` property.
 *          The `text` property contains the first element of each string in the input array,
 *          and the `numbers` property contains an array of numbers obtained by splitting the second element
 *          of each string in the input array by commas and converting them to numbers.
 *
 * @example
 * const linesFromInput = ['line1 1,2,3', 'line2 4,5,6'];
 * const result = getLines(linesFromInput);
 * console.log(result);
 * // Output: [{ text: 'line1', numbers: [1, 2, 3] }, { text: 'line2', numbers: [4, 5, 6] }]
 */
function getLines(linesFromInput: string[]) {
	return linesFromInput
		.map((line) => line.split(/\s+/))
		.map(([text, numbers]) => ({ text, numbers: numbers.split(',').map(Number) }));
}

/**
 * Checks if a given substring of a text can fit into a specific position without overlapping with any existing characters.
 *
 * @param text - The text to check if the substring fits.
 * @param position - The starting position of the substring in the text.
 * @param length - The length of the substring.
 * @returns Returns `true` if the substring can fit into the specified position without overlapping with any existing characters, otherwise returns `false`.
 */
function fits(text: string, position: number, length: number) {
	if (position > 0 && text[position - 1] === '#') return false;

	if (text[position + length] === '#') return false;

	for (let index = 0; index < length; index++) {
		if (text[position + index] === '.') {
			return false;
		}
	}

	return true;
}

/**
 * Calculates the number of possible combinations of numbers that can be placed in a given text string.
 *
 * @param text - The text string where numbers need to be placed.
 * @param numbers - An array of numbers that need to be placed in the text string.
 * @param startText - The starting index in the text string where the placement of numbers should begin.
 * @param startNumber - The index of the first number in the `numbers` array that needs to be placed.
 * @param minNeeded - The minimum number of characters needed to be available in the text string for successful placement of numbers.
 * @param cache - A cache object used to store previously calculated results for optimization purposes.
 * @returns The total number of possible combinations of numbers that can be placed in the text string.
 */
function countPossibilities(
	text: string,
	numbers: number[],
	startText: number,
	startNumber: number,
	minNeeded: number,
	cache: Map<string, number>,
) {
	// eslint-disable-next-line prefer-rest-params
	const cacheKey = key(arguments);
	if (!cache.has(cacheKey)) {
		if (startNumber >= numbers.length) {
			cache.set(cacheKey, 1);
			for (let index = text.length - 1; index >= startText; index--) {
				if (text[index] === '#') {
					cache.set(cacheKey, 0);
					break;
				}
			}
		} else {
			const nr = numbers[startNumber];
			let counter = 0;
			let startMax = text.length - minNeeded;
			for (let index = startMax; index >= startText; index--) {
				if (text[index] === '#') {
					startMax = index;
				}
			}
			for (let index = startMax; index >= startText; index--) {
				if (fits(text, index, nr)) {
					counter += countPossibilities(
						text,
						numbers,
						index + nr + 1,
						startNumber + 1,
						minNeeded - nr - 1,
						cache,
					);
				}
			}
			cache.set(cacheKey, counter);
		}
	}

	return cache.get(cacheKey) ?? 0;
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const linesFromInput = await parseLines(input);
	const lines = getLines(linesFromInput);

	const cache = new Map<string, number>();

	const result = sum(
		lines.map(({ text, numbers }) => {
			return countPossibilities(text, numbers, 0, 0, sum(numbers) + numbers.length - 1, cache);
		}),
	);

	return result;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const linesFromInput = await parseLines(input);
	const lines = getLines(linesFromInput);

	const cache = new Map<string, number>();

	const result = sum(
		lines
			.map(({ text, numbers }) => ({
				text: Array.from({ length: 5 }).fill(text).join('?'),
				numbers: Array.from({ length: 5 }).fill(numbers).flat() as number[],
			}))
			.map(({ text, numbers }) => {
				return countPossibilities(text, numbers, 0, 0, sum(numbers) + numbers.length - 1, cache);
			}),
	);

	return result;
}
