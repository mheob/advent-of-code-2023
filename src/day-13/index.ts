import { readInput } from '../utils/io';

const input = await readInput('day-13');

type Table = string[][];

function transpose(table: Table) {
	return table[0].map((_column, index) => table.map((row) => row[index]));
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

const findMirror = (table: Table) => {
	for (let index = 1; index < table.length; index++) {
		const firstPart = table.slice(0, index).reverse();
		const secondPart = table.slice(index);

		firstPart.splice(secondPart.length);
		secondPart.splice(firstPart.length);

		if (JSON.stringify(firstPart) === JSON.stringify(secondPart)) {
			return index;
		}
	}
	return 0;
};

export async function part1() {
	let result = 0;
	input
		.trim()
		.split('\n\n')
		.forEach((puzzle) => {
			const table: Table = puzzle.split('\n').map((row) => [...row].map((row) => row));
			result += findMirror(table) * 100 + findMirror(transpose(table));
		});

	return result;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

function fixSmudge(table: Table) {
	for (let index = 1; index < table.length; index++) {
		const firstPart = table.slice(0, index).reverse();
		const secondPart = table.slice(index);

		firstPart.splice(secondPart.length);
		secondPart.splice(firstPart.length);

		let changes = 0;
		firstPart.forEach((row, index) => {
			row.forEach((_column, index2) => {
				changes += firstPart[index][index2] === secondPart[index][index2] ? 0 : 1;
			});
		});
		if (changes === 1) {
			return index;
		}
	}
	return 0;
}

export async function part2() {
	let result = 0;
	input
		.trim()
		.split('\n\n')
		.forEach((puzzle) => {
			const table: Table = puzzle.split('\n').map((row) => [...row].map((row) => row));
			result += fixSmudge(table) * 100 + fixSmudge(transpose(table));
		});

	return result;
}
