import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-09');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

function getValues(line: number[]) {
	return line.map((value, index, array) => array[index + 1] - value).slice(0, -1);
}

export async function part1() {
	const lines = await parseLines(input);

	const sum = lines
		.map((line) => line.split(' ').map(Number))
		.reduce((accumulator, line) => {
			const list = [line.at(-1)];
			let value = line;

			do {
				value = getValues(value);
				list.push(value.at(-1));
			} while (!value.every((v) => v === value[0]));

			return (
				accumulator +
				(list as number[]).toReversed().reduce((accumulator, value) => accumulator + value)
			);
		}, 0);

	return sum;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	const sum = lines
		.map((line) => line.split(' ').map(Number))
		.reduce((accumulator, line) => {
			const list = [line[0]];
			let value = line;

			do {
				value = getValues(value);
				list.push(value[0]);
			} while (!value.every((v) => v === value[0]));

			const toAdd = list
				.toReversed()
				.reduce(
					(listAccumulator, current, index) => (index === 0 ? current : current - listAccumulator),
					0,
				);

			return accumulator + toAdd;
		}, 0);

	return sum;
}
