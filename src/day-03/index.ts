import { range } from '../utils/common';
import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-03');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

function isNumber(character: string) {
	return /\d/.test(character);
}

export async function part1() {
	const lines = await parseLines(input);

	const height = lines.length;
	const width = lines[0].length;

	function isSymbol(row: number, column: number) {
		if (!(0 <= row && row < height && 0 <= column && column < width)) {
			return false;
		}

		// is not a number and is not a `.`
		return !/[\d.]/.test(lines[row][column]);
	}

	let sum = 0;

	lines.forEach((line, lineNumber) => {
		let start = 0;
		let column = 0;

		while (column < width) {
			let numberAsString = '';
			start = column;

			while (column < width && isNumber(line[column])) {
				numberAsString += line[column];
				column++;
			}

			if (numberAsString === '') {
				column++;
				continue;
			}

			const number_ = Number(numberAsString);

			if (isSymbol(lineNumber, start - 1) || isSymbol(lineNumber, column)) {
				sum += number_;
				column++;
				continue;
			}

			for (const position of range(start - 1, column + 1)) {
				if (isSymbol(lineNumber - 1, position) || isSymbol(lineNumber + 1, position)) {
					sum += number_;
					break;
				}
			}
		}
	});

	return sum;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	const height = lines.length;
	const width = lines[0].length;

	const gears: number[][][] = [];
	for (let index = 0; index < height; index++) {
		const row: number[][] = [];
		for (let index = 0; index < width; index++) {
			row.push([]);
		}
		gears.push(row);
	}

	function neighborIsSymbol(row: number, column: number, number_: number) {
		if (!(0 <= row && row < height && 0 <= column && column < width)) {
			return false;
		}

		if (lines[row][column] === '*') {
			gears[row][column].push(number_);
		}

		// is not a number and is not a `.`
		return !/[\d.]/.test(lines[row][column]);
	}

	let sum = 0;

	lines.forEach((line, lineNumber) => {
		let start = 0;
		let column = 0;

		while (column < width) {
			let numberAsString = '';
			start = column;

			while (column < width && isNumber(line[column])) {
				numberAsString += line[column];
				column++;
			}

			if (numberAsString === '') {
				column++;
				continue;
			}

			const number_ = Number(numberAsString);

			if (
				neighborIsSymbol(lineNumber, start - 1, number_) ||
				neighborIsSymbol(lineNumber, column, number_)
			) {
				// SideEffect: fill the gears
			}

			for (const position of range(start - 1, column + 1)) {
				if (
					neighborIsSymbol(lineNumber - 1, position, number_) ||
					neighborIsSymbol(lineNumber + 1, position, number_)
				) {
					// SideEffect: fill the gears
				}
			}
		}
	});

	for (let lineNumber = 0; lineNumber < height; lineNumber++) {
		for (let columnNumber = 0; columnNumber < height; columnNumber++) {
			const numbers = gears[lineNumber][columnNumber];
			if (lines[lineNumber][columnNumber] === '*' && numbers.length === 2) {
				sum += numbers[0] * numbers[1];
			}
		}
	}

	return sum;
}
