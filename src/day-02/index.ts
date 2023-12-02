import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-02');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

const limit: Record<'red' | 'green' | 'blue', number> = {
	red: 12,
	green: 13,
	blue: 14,
};

export async function part1() {
	const lines = await parseLines(input);

	const sum = lines.reduce((accumulator, line) => {
		const [gameId, draws] = line.split(': ');
		const id = Number.parseInt(gameId.split(' ')[1]);

		return draws.split(/; /g).some((subsets) =>
			subsets.split(/, /g).some((subset) => {
				const [number_, color] = subset.trim().split(' ');
				return Number.parseInt(number_) > limit[color as keyof typeof limit];
			}),
		)
			? accumulator
			: accumulator + id;
	}, 0);

	return sum;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	const sum = lines.reduce((totalSum, line) => {
		const draws = line.split(': ')[1];
		const map = new Map<string, number>();

		for (const subsets of draws.split(/; /g)) {
			for (const subset of subsets.split(/, /g)) {
				const [number_, color] = subset.trim().split(' ');
				map.set(color, Math.max(map.get(color) ?? 0, Number(number_)));
			}
		}

		return totalSum + [...map.values()].reduce((accumulator, value) => accumulator * value, 1);
	}, 0);

	return sum;
}
