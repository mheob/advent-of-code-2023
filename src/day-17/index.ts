import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-17');

type Point = {
	x: number;
	y: number;
	cost: number;
	key: string;
};

type Crucible = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	moved: number;
	totalCost: number;
};

/**
 * Takes an array of strings as input and returns an array of objects representing points.
 * Each point object contains the x and y coordinates, the cost value parsed from the character in the input string, and a key string generated from the coordinates.
 *
 * @param lines - An array of strings representing the lines of characters.
 * @returns An array of objects representing points. Each point object contains the x and y coordinates, the cost value parsed from the character in the input string, and a key string generated from the coordinates.
 */
function getData(lines: string[]): Point[] {
	return lines.flatMap((line, y) =>
		[...line].map((char, x) => ({ x, y, cost: Number.parseInt(char), key: `${x};${y}` })),
	);
}

/**
 * Creates a lookup object from an array of Point objects.
 * Each Point object is indexed by its key property in the lookup object.
 *
 * @param data - The array of Point objects to create the lookup from.
 * @returns The lookup object where each Point object is indexed by its key property.
 */
function getLookup(data: Point[]) {
	return data.reduce(
		(result, next) => {
			result[`${next.key}`] = next;
			return result;
		},
		{} as Record<string, Point>,
	);
}

/**
 * Gets the maximum x and y positions from an array of Point objects.
 *
 * @param data - The array of Point objects
 * @returns Object containing the maxX and maxY values
 */
function getMaxPositions(data: Point[]) {
	const maxX = Math.max(...data.map((b) => b.x));
	const maxY = Math.max(...data.map((b) => b.y));
	return { maxX, maxY };
}

/**
 * Solves the puzzle to find the minimum cost path from (0, 0) to (maxX, maxY) using breadth-first search.
 *
 * @param lookup - Lookup object mapping point keys to Point objects
 * @param maxX - Maximum X coordinate
 * @param maxY - Maximum Y coordinate
 * @param minMoves - Minimum number of moves before allowing turns
 * @param maxMoves - Maximum number of moves to search
 * @returns The minimum cost found to reach (maxX, maxY) within maxMoves
 */
function solve(
	lookup: Record<string, Point>,
	maxX: number,
	maxY: number,
	{ minMoves, maxMoves }: { minMoves: number; maxMoves: number },
) {
	let cost = 0;
	const visited = new Set<string>();

	let edges = [
		{ x: 0, y: 0, vx: +1, vy: 0, moved: 0, totalCost: 0 },
		{ x: 0, y: 0, vx: 0, vy: +1, moved: 0, totalCost: 0 },
	];

	while (edges.length > 0) {
		const newEdges = [] as Crucible[];

		for (const c of edges) {
			const crucibleKey = `${c.x};${c.y};${c.vx};${c.vy};${c.moved}`;
			if (visited.has(crucibleKey)) continue;

			if (c.totalCost > cost) {
				newEdges.push(c);
				continue;
			}

			if (c.totalCost < cost) throw 'Unexpectedly skipped crucible';

			if (c.x === maxX && c.y === maxY && c.moved >= minMoves) return c.totalCost;

			visited.add(crucibleKey);

			// Straight ahead (if possible)
			if (c.moved < maxMoves && lookup[`${c.x + c.vx};${c.y + c.vy}`]) {
				newEdges.push({
					x: c.x + c.vx,
					y: c.y + c.vy,
					vx: c.vx,
					vy: c.vy,
					moved: c.moved + 1,
					totalCost: c.totalCost + lookup[`${c.x + c.vx};${c.y + c.vy}`].cost,
				});
			}

			// Turns (if allowed)
			if (c.moved >= minMoves) {
				const turns =
					c.vy === 0
						? [
								{ vx: 0, vy: -1 },
								{ vx: 0, vy: +1 },
						  ]
						: [
								{ vx: +1, vy: 0 },
								{ vx: -1, vy: 0 },
						  ];

				turns.forEach((turn) => {
					if (lookup[`${c.x + turn.vx};${c.y + turn.vy}`]) {
						newEdges.push({
							x: c.x + turn.vx,
							y: c.y + turn.vy,
							vx: turn.vx,
							vy: turn.vy,
							moved: 1,
							totalCost: c.totalCost + lookup[`${c.x + turn.vx};${c.y + turn.vy}`].cost,
						});
					}
				});
			}
		}

		edges = newEdges;
		cost++;
	}

	throw 'Search returned no result';
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	const data = getData(lines);
	const lookup = getLookup(data);
	const { maxX, maxY } = getMaxPositions(data);

	return solve(lookup, maxX, maxY, { minMoves: 0, maxMoves: 3 });
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	const data = getData(lines);
	const lookup = getLookup(data);
	const { maxX, maxY } = getMaxPositions(data);

	return solve(lookup, maxX, maxY, { minMoves: 4, maxMoves: 10 });
}
