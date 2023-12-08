import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-08');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

type ChildrenMap = {
	[key: string]: [string, string];
};

export async function part1() {
	const lines = await parseLines(input);

	const children: ChildrenMap = {};

	const steps = lines[0];

	lines.slice(1).forEach((line) => {
		const [, parent, left, right] = /(...) = \((...), (...)\)/.exec(line) || [];
		children[parent] = [left, right];
	});

	let current = 'AAA';
	let count = 0;
	while (current !== 'ZZZ') {
		const step = steps[count % steps.length];
		current = step === 'L' ? children[current][0] : children[current][1];
		count++;
	}

	return count;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);

	const children: ChildrenMap = {};

	const steps = lines[0];

	lines.slice(1).forEach((line) => {
		const [, parent, left, right] = /(...) = \((...), (...)\)/.exec(line) || [];
		children[parent] = [left, right];
	});

	const current = Object.keys(children).filter((x) => x[2] === 'A');

	const lengths = current.map((current: string) => {
		let count = 0;
		while (current[2] !== 'Z') {
			const step = steps[count % steps.length];
			current = step === 'L' ? children[current][0] : children[current][1];
			count += 1;
		}
		return count;
	});

	const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
	const lcmOfTwo = (a: number, b: number): number => (a * b) / gcd(a, b);

	const sum = lengths.reduce((a, b) => lcmOfTwo(a, b));

	return sum;
}
