/* eslint-disable prettier/prettier */
/* eslint-disable unused-imports/no-unused-vars */
import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-11');

function getGalaxy(lines: string[]) {
	return lines
		.flatMap((row, y) =>
			[...row]
				.map((char, x) => (char === '#' ? [Number(x), Number(y)] : []))
				.filter((x) => x.length > 0),
		)
		.filter((x) => x.length > 0);
}

function getDimensions(galaxy: number[][]) {
	const width = galaxy.reduce((max, [x, _y]) => (max > x ? max : Number(x)), 0) + 1;
	const height = galaxy.reduce((max, [_x, y]) => (max > y ? max : Number(y)), 0) + 1;
	return [width, height];
}

function getEmptyCols(galaxy: number[][], width: number) {
	return [...Array.from({ length: width }).keys()]
		.map(Number)
		.filter((col) => !galaxy.some(([x, _y]) => x === col));
}

function getEmptyRows(galaxy: number[][], height: number) {
	return [...Array.from({ length: height }).keys()]
		.map(Number)
		.filter((row) => !galaxy.some(([_x, y]) => y === row));
}

function expand(x: number, y: number, emptyCols: number[], emptyRows: number[], factor: number) {
	x += Number(emptyCols.filter((col) => col < x).length) * (factor - 1);
	y += Number(emptyRows.filter((row) => row < y).length) * (factor - 1);
	return [x, y];
}

function abs(x: number) {
	return x < 0 ? -x : x;
}

function shortestPath(a: number[], b: number[]) {
	return abs(a[0] - b[0]) + abs(a[1] - b[1]);
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);

	const galaxy = getGalaxy(lines);
	const [width, height] = getDimensions(galaxy);

	const emptyCols = getEmptyCols(galaxy, width);
	const emptyRows = getEmptyRows(galaxy, height);

	const expanded = galaxy.map(([x, y]) => expand(x, y, emptyCols, emptyRows, 2));

	const pairs = expanded.flatMap((a, index) => expanded.slice(index + 1).map((b) => [a, b]));

	return pairs.map(([a, b]) => shortestPath(a, b)).reduce((a, b) => a + b, 0);
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	const galaxy = getGalaxy(lines);
	const [width, height] = getDimensions(galaxy);

	const emptyCols = getEmptyCols(galaxy, width);
	const emptyRows = getEmptyRows(galaxy, height);

	const expanded = galaxy.map(([x, y]) => expand(x, y, emptyCols, emptyRows, 1_000_000));
	const pairs = expanded.flatMap((a, index) => expanded.slice(index + 1).map((b) => [a, b]));

	return pairs.map(([a, b]) => shortestPath(a, b)).reduce((a, b) => a + b, 0);
}
