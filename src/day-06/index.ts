import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-06');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);

	const [times, distances] = lines.map((line) =>
		line.trim().split(': ')[1].trim().split(/\s+/).map(Number),
	);

	const ways = times.map((time, waysIndex) => {
		let count = 0;
		for (let index = 0; index < time; index++) {
			// Hold down for i seconds
			if ((time - index) * index > distances[waysIndex]) {
				count++;
			}
		}
		return count;
	});

	let result = 1;
	ways.forEach((x) => {
		result *= x;
	});

	return result;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	const [time, distance] = lines.map((line) => Number.parseInt(line.split(' ').slice(1).join('')));

	let result = 0;

	for (let index = 0; index < time; index++) {
		// Hold down for i seconds
		if ((time - index) * index > distance) {
			result += 1;
		}
	}

	return result;
}
