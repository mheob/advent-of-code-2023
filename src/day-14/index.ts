import { sum } from '../utils/common';
import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-14', 'input');

type Point = {
	x: number;
	y: number;
	start: (position: string[][]) => number;
	next: (value: number) => number;
};

const NORTH: Point = { x: 0, y: -1, start: (_) => 0, next: (v) => v + 1 };
const WEST: Point = { x: -1, y: 0, start: (_) => 0, next: (v) => v + 1 };
const SOUTH: Point = { x: 0, y: 1, start: (p) => p.length - 1, next: (v) => v - 1 };
const EAST: Point = { x: 1, y: 0, start: (p) => p.length - 1, next: (v) => v - 1 };

/**
 * Moves a character ('O') in a 2D grid represented by the `lines` array.
 * Checks if the character can move to the next position specified by `nextX` and `nextY`,
 * and if so, updates the grid accordingly.
 *
 * @param lines - A 2D grid representing the current state of the game board.
 * @param x - The x-coordinate of the current position of the character.
 * @param y - The y-coordinate of the current position of the character.
 * @param nextX - The x-coordinate of the next position to move the character to.
 * @param nextY - The y-coordinate of the next position to move the character to.
 * @returns Returns 1 if the character was successfully moved to the next position, or 0 if it couldn't be moved.
 */
function move(lines: string[][], x: number, y: number, nextX: number, nextY: number) {
	const character = lines[y][x];
	const nextCharacter = lines[nextY] ? lines[nextY][nextX] : undefined;
	if (character === 'O' && nextCharacter === '.') {
		lines[nextY][nextX] = character;
		lines[y][x] = '.';
		return 1;
	}
	return 0;
}

/**
 * Moves characters in a grid based on a given direction.
 *
 * @param lines - A 2D array representing the grid of characters.
 * @param direction - The direction in which to move the characters.
 * @returns None. The function modifies the `lines` array in place.
 *
 * @example
 * const lines = [
 *   ['O', '.', '.', 'O'],
 *   ['.', '.', 'O', '.'],
 *   ['.', 'O', '.', '.'],
 *   ['O', '.', '.', 'O']
 * ];
 *
 * tilt(lines, NORTH);
 * console.log(lines);
 * // Output:
 * // [
 * //   ['.', '.', '.', '.'],
 * //   ['O', '.', 'O', 'O'],
 * //   ['.', 'O', '.', '.'],
 * //   ['O', '.', '.', 'O']
 * // ]
 */
function tilt(lines: string[][], direction: Point) {
	let moves = 1;
	while (moves) {
		moves = 0;
		for (let y = direction.start(lines); y >= 0 && y < lines.length; y = direction.next(y)) {
			for (let x = direction.start(lines); x >= 0 && x < lines[y].length; x = direction.next(x)) {
				moves += move(lines, x, y, x + direction.x, y + direction.y);
			}
		}
	}
}

/**
 * Calculates the sum of the y-coordinate values for each 'O' character in the grid.
 * The y-coordinate values are based on the distance from the bottom of the grid.
 *
 * @param lines - A 2D array of strings representing a grid of characters.
 * @returns The sum of the y-coordinate values for each 'O' character in the grid.
 *
 * @example
 * const lines = [
 *   ['O', 'O', 'O'],
 *   ['O', 'X', 'O'],
 *   ['O', 'O', 'O'],
 * ];
 *
 * const result = load(lines);
 * console.log(result); // Output: 6
 */
function load(lines: string[][]) {
	return sum(
		lines.map((line, y) =>
			sum(line.map((character) => (character !== 'O' ? 0 : lines.length - y))),
		),
	);
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const linesFromInput = await parseLines(input);
	const lines = linesFromInput.map((line) => [...line]);

	tilt(lines, NORTH);

	return load(lines);
}

/**
 * Performs a series of tilting operations on a grid of strings and detects cycles in the grid.
 * If a cycle is detected, it adjusts the index accordingly and returns the final grid configuration.
 *
 * @param lines - A grid of strings representing the initial configuration.
 * @returns The final grid configuration after all iterations.
 */
function cycle(lines: string[][]) {
	const maps = new Map();

	for (let index = 0; index < 1_000_000_000; index++) {
		tilt(lines, NORTH);
		tilt(lines, WEST);
		tilt(lines, SOUTH);
		tilt(lines, EAST);
		const mapId = lines.map((line) => line.join('')).join('\n');
		if (maps.get(mapId)) {
			const cycleLength = index - maps.get(mapId);
			const remaining = 1_000_000_000 - index;
			index += Math.floor(remaining / cycleLength) * cycleLength;
			maps.clear();
		}
		maps.set(mapId, index);
	}

	return lines;
}

export async function part2() {
	const linesFromInput = await parseLines(input);
	const lines = linesFromInput.map((line) => [...line]);

	return load(cycle(lines));
}
