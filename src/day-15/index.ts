import { readInput } from '../utils/io';

const input = await readInput('day-15');

/**
 * Hashes the given string into a number between 0 and 255.
 *
 * Iterates through each character, gets its code point value,
 * adds it to a running total, multiplies by 17, and takes modulo 256.
 *
 * @param text - The string to hash
 * @returns The hashed value between 0 and 255
 */
function hash(text: string) {
	return [...text]
		.map((char) => char.codePointAt(0) ?? 0)
		.reduce((a, b) => ((a + b) * 17) % 256, 0);
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	let sum = 0;

	input
		.trim()
		.split(',')
		.forEach((word) => {
			sum += hash(word);
		});

	return sum;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const boxes = new Map<number, Map<string, number>>();

	input
		.trim()
		.split(',')
		.forEach((word) => {
			const operator = word.includes('-') ? '-' : '=';
			const [label, focalString] = word.split(/[=-]/);
			const focalLength = Number.parseInt(focalString);
			const boxId = hash(label);

			if (operator == '=') {
				const lenses = boxes.has(boxId)
					? boxes.get(boxId)
					: new Map<string, number>().set(label, focalLength);
				if (lenses) {
					lenses.set(label, focalLength);
					boxes.set(boxId, lenses);
				}
			} else {
				boxes.get(boxId)?.delete(label);
			}
		});

	let sum = 0;

	boxes.forEach((box, boxId) => {
		let index = 0;
		box.forEach((focal) => {
			index++;
			sum += (boxId + 1) * index * focal;
		});
	});

	return sum;
}
