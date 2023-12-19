import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-18');

const directories = { R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1] };

/**
 * Digs the corner coordinates from the path lines.
 *
 * @param lines - The path lines as arrays of [direction, meters]
 * @returns The array of corner coordinates
 */
const digCorners = (lines: string[][]) => {
	let position = [0, 0];
	const holes: number[][] = [];
	lines.forEach(([direction, meters]) => {
		const [dx, dy] = directories[direction as keyof typeof directories];
		position = [position[0] + dx * Number(meters), position[1] + dy * Number(meters)];
		holes.push(position);
	});
	return holes;
};

/**
 * Calculates the exterior trench perimeter using the Shoelace formula
 * on the provided array of corner coordinates.
 *
 * The Shoelace formula calculates the area of a polygon from its vertices.
 * We take the absolute value of the area, divide by 2 to get the perimeter,
 * and add the total length between vertices.
 *
 * @param coords - Array of x,y coordinate pairs for each corner vertex
 * @returns The calculated exterior trench perimeter
 */
const shoelaceFormula = (coords: number[][]) => {
	let sum = 0;
	let trenchLength = 0;
	for (let index = 0; index < coords.length; index++) {
		const next = coords[index + 1] ?? coords[0];
		const x = coords[index][0];
		const ny = next[1];
		const y = coords[index][1];
		const nx = next[0];
		sum += x * ny - y * nx;
		trenchLength += Math.abs(coords[index][0] - next[0]) + Math.abs(coords[index][1] - next[1]);
	}

	const shoelace = Math.abs(sum / 2);
	return shoelace + trenchLength / 2 + 1;
};

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	const corners = digCorners(lines.map((line) => line.split(' ')));
	return shoelaceFormula(corners);
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

/**
 * Transforms the movement plan into a format with direction, meters, and color.
 *
 * Takes the input lines array containing [_1, _2, color] and returns
 * [direction, meters, color]. It parses the color hex string to extract the
 * direction and meters.
 *
 * @param lines - The movement plan lines
 * @returns The transformed lines with direction, meters, and color
 */
function fixPlan(lines: string[][]) {
	return lines.map(([_1, _2, color]) => {
		const directionMap = ['R', 'D', 'L', 'U'];
		const meters = Number.parseInt(color.slice(2, 7), 16);
		const direction = directionMap[Number.parseInt(color.slice(7, 8))];
		return [direction, meters, color] as string[];
	});
}

export async function part2() {
	const lines = await parseLines(input);
	const corners = digCorners(fixPlan(lines.map((line) => line.split(' '))));
	return shoelaceFormula(corners);
}
