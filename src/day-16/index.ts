import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-16');

type Vector2 = {
	x: number;
	y: number;
};

type Beam = {
	position: Vector2;
	direction: Vector2;
};

/**
 * Body class represents a character on the grid.
 * It contains position, character type and a method to calculate
 * new beam directions when hit by a beam.
 */
class Body {
	key = '';

	constructor(
		public x: number,
		public y: number,
		public char: string,
	) {
		this.key = `${x};${y}`;
	}

	changeBeam(beam: Beam) {
		switch (this.char) {
			case '|': {
				{
					if (beam.direction.x === 0) return [beam];
					return [
						{ position: { x: beam.position.x, y: beam.position.y }, direction: { x: 0, y: -1 } },
						{ position: { x: beam.position.x, y: beam.position.y }, direction: { x: 0, y: +1 } },
					];
				}
			}
			case '-': {
				{
					if (beam.direction.y === 0) return [beam];
					return [
						{ position: { x: beam.position.x, y: beam.position.y }, direction: { x: -1, y: 0 } },
						{ position: { x: beam.position.x, y: beam.position.y }, direction: { x: +1, y: 0 } },
					];
				}
			}

			case '/': {
				{
					if (beam.direction.x === +1) beam.direction = { x: 0, y: -1 };
					else if (beam.direction.x === -1) beam.direction = { x: 0, y: +1 };
					else if (beam.direction.y === +1) beam.direction = { x: -1, y: 0 };
					else if (beam.direction.y === -1) beam.direction = { x: +1, y: 0 };
					return [beam];
				}
			}

			case '\\': {
				{
					if (beam.direction.x === +1) beam.direction = { x: 0, y: +1 };
					else if (beam.direction.x === -1) beam.direction = { x: 0, y: -1 };
					else if (beam.direction.y === +1) beam.direction = { x: +1, y: 0 };
					else if (beam.direction.y === -1) beam.direction = { x: -1, y: 0 };
					return [beam];
				}
			}

			default: {
				throw 'Unknown body';
			}
		}
	}
}

/**
 * Takes an array of strings as input and returns an array of `Body` objects.
 * Each `Body` object represents a character in the input string, along with its position in the string.
 *
 * @param input - An array of strings representing the input characters.
 * @returns An array of `Body` objects, where each object represents a character in the input string along with its position.
 */
function getBodies(input: string[]): Body[] {
	return input.flatMap((line, y) => [...line].map((char, x) => new Body(x, y, char)));
}

/**
 * Returns a lookup table where each key is a unique identifier for a body and the corresponding value is the body object itself.
 *
 * @param bodies - An array of `Body` objects representing characters in the input string along with their positions.
 * @returns A lookup table where each key is a unique identifier for a body and the corresponding value is the body object itself.
 */
function getLookup(bodies: Body[]) {
	return bodies
		.filter((b) => b.char !== '.')
		.reduce(
			(result, body) => {
				result[body.key] = body;
				return result;
			},
			{} as Record<string, Body>,
		);
}

/**
 * Calculates the size of the energized area based on a starting position and direction.
 *
 * @param position - The starting position of the beam.
 * @param direction - The direction of the beam.
 * @param bodies - An array of Body objects representing the bodies in the space.
 * @param lookup - A lookup table mapping body keys to body objects.
 * @returns The size of the energized area, which is the number of unique positions visited by the beams.
 */
function getEnergizedSizeFrom(
	position: Vector2,
	direction: Vector2,
	bodies: Body[],
	lookup: Record<string, Body>,
) {
	const emptySpaces = new Set(bodies.filter((b) => b.char === '.').map((b) => b.key));
	const energized = new Set<string>();
	const visited = new Set<string>();
	const beamKeys = new Set<string>();
	let beams = [{ position, direction }];

	while (beams.length > 0) {
		const newBeams: Beam[] = [];

		beams.forEach((current) => {
			const key = `${current.position.x};${current.position.y}`;

			if (emptySpaces.has(key)) energized.add(key);
			if (current.position.x >= 0) visited.add(key);

			current.position.x += current.direction.x;
			current.position.y += current.direction.y;

			const newKey = `${current.position.x};${current.position.y}`;
			const body = lookup[newKey];

			if (body) {
				body.changeBeam(current).forEach((b) => newBeams.push(b));
			} else if (emptySpaces.has(newKey)) {
				newBeams.push(current);
			}
		});

		beams = newBeams.filter(
			(b) => !beamKeys.has(`${b.position.x};${b.position.y};${b.direction.x};${b.direction.y}`),
		);
		beams.forEach((b) =>
			beamKeys.add(`${b.position.x};${b.position.y};${b.direction.x};${b.direction.y}`),
		);
	}

	return visited.size;
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	const bodies = getBodies(lines);
	const lookup = getLookup(bodies);

	return getEnergizedSizeFrom({ x: -1, y: 0 }, { x: 1, y: 0 }, bodies, lookup);
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	const bodies = getBodies(lines);
	const lookup = getLookup(bodies);

	let result = 0;

	for (let y = 0; y < lines.length; y++) {
		result = Math.max(
			result,
			getEnergizedSizeFrom({ x: -1, y }, { x: +1, y: 0 }, bodies, lookup),
			getEnergizedSizeFrom({ x: lines[0].length, y }, { x: -1, y: 0 }, bodies, lookup),
		);
	}

	for (let x = 0; x < lines.length; x++) {
		result = Math.max(
			result,
			getEnergizedSizeFrom({ x, y: -1 }, { x: 0, y: +1 }, bodies, lookup),
			getEnergizedSizeFrom({ x, y: lines.length }, { x: 0, y: -1 }, bodies, lookup),
		);
	}

	return result;
}
