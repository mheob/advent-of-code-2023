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

	function neighborIsSymbol(row: number, column: number) {
		if (!(0 <= row && row < height && 0 <= column && column < width)) {
			return false;
		}

		// is not a number and is not a dot (`.`)
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

			if (neighborIsSymbol(lineNumber, start - 1) || neighborIsSymbol(lineNumber, column)) {
				sum += number_;
				column++;
				continue;
			}

			for (const position of range(start - 1, column + 1)) {
				if (
					neighborIsSymbol(lineNumber - 1, position) ||
					neighborIsSymbol(lineNumber + 1, position)
				) {
					sum += number_;
					break;
				}
			}
		}
	});

	return sum;
}
