import { parseLines, readInput } from '../utils/io';

// const input = await readInput('day-21');
const input = await readInput('day-21', 'example');

type Vector2 = {
	x: number;
	y: number;
};

type Location = {
	char: string;
	key: string;
} & Vector2;

function getLocations(lines: string[][]) {
	return lines.flatMap((line, y) =>
		line.map((char, x) => ({
			key: `${x};${y}`,
			x,
			y,
			char,
		})),
	);
}

function getLookup(locations: Location[]) {
	return locations.reduce(
		(result, next) => {
			result[next.key] = next;
			return result;
		},
		{} as Record<string, Location>,
	);
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	// const locations = getLocations(lines.filter(Boolean).map((line) => [...line]));
	// const lookup = getLookup(locations);

	// const startLocation = locations.find((location) => location.char === 'S');
	// if (!startLocation) throw new Error('Start location not found');
	// const start: Vector2 = { x: startLocation.x, y: startLocation.y };
	// startLocation.char = '.';

	// const steps = 64;
	// const directions = [
	// 	{ dX: -1, dY: 0 },
	// 	{ dX: 1, dY: 0 },
	// 	{ dX: 0, dY: -1 },
	// 	{ dX: 0, dY: 1 },
	// ];
	// let options = [start];
	// for (let index = 0; index < steps; index++) {
	// 	const newOptions: Vector2[] = [];
	// 	const considered = new Set<string>();

	// 	options.forEach((option) => {
	// 		directions.forEach((direction) => {
	// 			const newPos = { x: option.x + direction.dX, y: option.y + direction.dY };
	// 			const newKey = `${newPos.x};${newPos.y}`;
	// 			if (considered.has(newKey)) return;
	// 			considered.add(newKey);
	// 			if (!lookup[newKey]) return;
	// 			if (lookup[newKey].char === '#') return;
	// 			newOptions.push(newPos);
	// 		});
	// 	});

	// 	options = newOptions;
	// }

	// return options.length;
	return lines.length;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	const locations = getLocations(lines.filter(Boolean).map((line) => [...line]));
	const lookup = getLookup(locations);

	const maxX = lines.filter(Boolean).map((line) => [...line]).length;
	const maxY = lines.filter(Boolean).map((line) => [...line]).length;

	const startLocation = locations.find((location) => location.char === 'S');
	if (!startLocation) throw new Error('Start location not found');
	const start: Vector2 = { x: startLocation.x, y: startLocation.y };
	startLocation.char = '.';

	const steps = 26_501_365;
	const directions = [
		{ dX: -1, dY: 0 },
		{ dX: 1, dY: 0 },
		{ dX: 0, dY: -1 },
		{ dX: 0, dY: 1 },
	];
	let options = [start];
	for (let index = 0; index < steps; index++) {
		const newOptions: Vector2[] = [];
		const considered = new Set<string>();

		options.forEach((option) => {
			directions.forEach((direction) => {
				const newPos = { x: option.x + direction.dX, y: option.y + direction.dY };
				const newKey = `${newPos.x};${newPos.y}`;

				if (considered.has(newKey)) return;
				considered.add(newKey);

				const lookupX = newPos.x >= 0 ? newPos.x % maxX : (maxX + (newPos.x % maxX)) % maxX;
				const lookupY = newPos.y >= 0 ? newPos.y % maxY : (maxY + (newPos.y % maxY)) % maxY;
				const target = lookup[`${lookupX};${lookupY}`];

				if (target.char !== '.') return;

				newOptions.push(newPos);
			});
		});

		options = newOptions;
	}

	return options.length;
}
