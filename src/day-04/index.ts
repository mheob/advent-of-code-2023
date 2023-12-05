import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-04');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

function getNumbers(part: string) {
	return part
		.trim()
		.split(' ')
		.filter(Boolean)
		.map((x) => Number.parseInt(x, 10));
}

export async function part1() {
	const lines = await parseLines(input);

	let sum = 0;

	lines.forEach((line) => {
		const numbers = line.split(':')[1].split('|');

		const winning = getNumbers(numbers[0]);
		const ours = getNumbers(numbers[1]);

		let score = 0;
		ours.forEach((number_) => {
			if (winning.includes(number_)) {
				score++;
			}
		});

		if (score > 0) {
			sum += 2 ** (score - 1);
		}
	});

	return sum;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	const numberOfLines = lines.length;
	const copies: number[][] = Array.from({ length: numberOfLines }, () => []);

	lines.forEach((line, lineNumber) => {
		const parts = line.split(/\s+/);
		const indexOfPipe = parts.indexOf('|');
		const winning = new Set(parts.slice(2, indexOfPipe).map((number_) => Number.parseInt(number_)));
		const ours = parts.slice(indexOfPipe + 1).map((number_) => Number.parseInt(number_));

		let score = 0;
		ours.forEach((number_) => {
			if (winning.has(number_)) {
				score += 1;
			}
		});

		for (let index = lineNumber + 1; index <= lineNumber + score; index++) {
			copies[lineNumber].push(index);
		}
	});

	const scores = Array.from({ length: numberOfLines }).fill(1) as number[];

	for (let lineNumber = numberOfLines - 1; lineNumber >= 0; lineNumber--) {
		copies[lineNumber].forEach((index) => {
			scores[lineNumber] += scores[index];
		});
	}

	return scores.reduce((sum, currentValue) => sum + currentValue, 0);
}
