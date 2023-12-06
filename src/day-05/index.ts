import { readInput } from '../utils/io';

const input = await readInput('day-05');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

type NumbersMaps = [number, number, number][];
type NumbersTuple = [number, number];

function getValueFromRanges(value: number, ranges: NumbersMaps) {
	for (const [destinationStart, sourceStart, rangeLength] of ranges) {
		if (value >= sourceStart && value < sourceStart + rangeLength) {
			return destinationStart + (value - sourceStart);
		}
	}

	return value;
}

export async function part1() {
	const [seedsLine, ...lines] = input.trim().split('\n\n');
	const seeds = seedsLine.split(' ').slice(1).map(Number);

	const maps = lines.map(
		(part) =>
			part
				.trim()
				.split('\n')
				.map((line) => line.trim().split(' ').map(Number)) as NumbersMaps,
	);

	let min = Number.POSITIVE_INFINITY;

	for (const seed of seeds) {
		let transformedSeed = seed;
		for (const ranges of maps) {
			transformedSeed = getValueFromRanges(transformedSeed, ranges);
		}
		min = Math.min(min, transformedSeed);
	}

	return min;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const [seedsLine, ...lines] = input.trim().split('\n\n');

	const seedsInput = seedsLine.split(' ').slice(1).map(Number);
	const seeds = seedsInput
		.map((seed, index) => (index % 2 === 0 ? [seed, seed + seedsInput[index + 1] - 1] : null))
		.filter(Boolean) as NumbersTuple[];

	const maps = lines.map(
		(part) =>
			part
				.trim()
				.split('\n')
				.map((line) => line.trim().split(' ').map(Number)) as NumbersMaps,
	);

	let parts = seeds.map(([from, to]) => [from, to]) as NumbersTuple[];

	for (const ranges of maps) {
		const newParts: NumbersTuple[] = [];

		for (const part of parts) {
			// eslint-disable-next-line prefer-const
			let [start, end] = part;

			while (start <= end) {
				const range = ranges.find((range) => start >= range[1] && start <= range[1] + range[2] - 1);
				if (range) {
					const rangeEnd = Math.min(end, range[1] + range[2] - 1);
					newParts.push([start + range[0] - range[1], rangeEnd + range[0] - range[1]]);
					start = rangeEnd + 1;
				} else {
					start++;
				}
			}
		}

		parts = newParts;
	}

	const min = Math.min(...parts.map((part) => part[0]));

	return min;
}
