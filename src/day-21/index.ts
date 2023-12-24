import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-21');

const directories = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);

	let positions: Set<string> = new Set();
	const map = lines.map((line, r) =>
		[...line].map((char, c) => {
			if (char === 'S') {
				positions.add([r, c].join(','));
			}
			return Number(char !== '#');
		}),
	);

	for (let index = 0; index < 64; index++) {
		const nextPositions: typeof positions = new Set();
		for (const p of positions) {
			const [r, c] = p.split(',').map(Number);
			for (const [dr, dc] of directories) {
				if (map[r + dr]?.[c + dc]) {
					nextPositions.add([r + dr, c + dc].join(','));
				}
			}
		}
		positions = nextPositions;
	}

	return positions.size;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	let positions: Set<string> = new Set();
	const map = lines.map((line, r) =>
		[...line].map((char, c) => {
			if (char === 'S') {
				positions.add([r, c].join(','));
			}
			return +(char !== '#');
		}),
	);
	const size = map.length;

	const target = 26_501_365;
	const counts = [];
	for (let index = 0; index < target; index++) {
		const nextPositions: typeof positions = new Set();
		for (const p of positions) {
			const [r, c] = p.split(',').map(Number);
			for (const [dr, dc] of directories) {
				const r2 = r + dr;
				const c2 = c + dc;
				if (map.at(r2 % size)!.at(c2 % size)) {
					nextPositions.add([r2, c2].join(','));
				}
			}
		}

		positions = nextPositions;
		if ((index + 1) % size === target % size) {
			if (
				counts.length >= 3 &&
				positions.size - 2 * counts.at(-1)! + counts.at(-2)! ===
					counts.at(-1)! - 2 * counts.at(-2)! + counts.at(-3)!
			) {
				// converged
				break;
			}
			counts.push(positions.size);
		}
	}

	// second derivative
	const d2 = counts.at(-1)! - 2 * counts.at(-2)! + counts.at(-3)!;
	for (let index = counts.length * size + (target % size); index <= target; index += size) {
		counts.push(d2 + 2 * counts.at(-1)! - counts.at(-2)!);
	}

	return counts.at(-1);
}
