import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-01');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	const numbers = lines.map((line) => {
		const firstDigit = line.match(/\d/)?.[0];
		const lastDigit = line.match(/(\d)[a-z]*$/)?.[1];
		return Number.parseInt(`${firstDigit}${lastDigit}`);
	});

	return numbers.reduce((sum, currentValue) => sum + currentValue, 0);
}

const numberMap = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
} as const;

type NumbersAsText = keyof typeof numberMap;

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	const numbers = lines.map((line) => {
		Object.keys(numberMap).forEach((key) => {
			if (line.includes(key))
				line = line.replaceAll(key, `${key}${numberMap[key as NumbersAsText]}${key}`);
		});
		const firstDigit = line.match(/\d/)?.[0];
		const lastDigit = line.match(/(\d)[a-z]*$/)?.[1];
		return Number.parseInt(`${firstDigit}${lastDigit}`);
	});

	return numbers.reduce((sum, currentValue) => sum + currentValue, 0);
}
