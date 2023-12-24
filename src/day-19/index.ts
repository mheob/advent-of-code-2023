import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-19');
// const input = await readInput('day-19', 'example');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const [workflows, ratings] = await parseLines(input, '\n\n');
	const map: Record<string, (parts: Record<string, number>) => boolean | undefined> = {};

	for (const line of workflows.split('\n')) {
		const [name, rules] = line.split(/[{}]/g);
		map[name] = (parts) => {
			function isAccepted(target: string) {
				return target === 'A' || (target !== 'R' && map[target](parts));
			}

			for (const rule of rules.split(',')) {
				if (rule.includes(':')) {
					const [expr, target] = rule.split(':');
					const op = expr.match(/\W/g)?.[0] ?? '';
					const [left, right] = expr.split(op);
					if (op === '>' ? parts[left] > +right : parts[left] < +right) {
						return isAccepted(target);
					}
				} else {
					return isAccepted(rule);
				}
			}
		};
	}

	let sum = 0;
	for (const line of ratings.split('\n')) {
		const words = line.split(/\W/g).slice(1, -1);
		const parts: Record<string, number> = {};

		for (let index = 0; index < words.length; index += 2) {
			parts[words[index]] = Number(words[index + 1]);
		}

		if (map.in(parts)) {
			sum += Object.values(parts).reduce((accumulator, n) => accumulator + n);
		}
	}

	return sum;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

type Part = 'x' | 'm' | 'a' | 's';

export async function part2() {
	const possibleRanges = {
		x: [1, 4000],
		m: [1, 4000],
		a: [1, 4000],
		s: [1, 4000],
	};

	type Ranges = typeof possibleRanges;

	const [workflows] = await parseLines(input, '\n\n');
	const map: Record<string, (ranges: Ranges) => number> = {};

	function getCombos(target: string, ranges: Ranges) {
		return target === 'A'
			? Object.values(ranges)
					.map(([min, max]) => max - min + 1)
					.reduce((accumulator, n) => accumulator * n)
			: target !== 'R'
			  ? map[target](ranges)
			  : 0;
	}

	for (const line of workflows.split('\n')) {
		const [name, rules] = line.split(/[{}]/g);
		map[name] = (ranges) => {
			let sum = 0;
			for (const rule of rules.split(',')) {
				if (rule.includes(':')) {
					const [expr, target] = rule.split(':');
					const op = expr.match(/\W/g)?.[0] ?? '';
					const part = expr.split(op)[0] as Part;
					const value = Number(expr.split(op)[1]);
					const yesRanges = structuredClone(ranges);

					if (op === '>') {
						yesRanges[part][0] = Math.max(yesRanges[part][0], value + 1);
						ranges[part][1] = Math.min(ranges[part][1], value);
					} else {
						yesRanges[part][1] = Math.min(yesRanges[part][1], value - 1);
						ranges[part][0] = Math.max(ranges[part][0], value);
					}

					sum += getCombos(target, yesRanges);
				} else {
					sum += getCombos(rule, ranges);
				}
			}

			return sum;
		};
	}

	return map.in(possibleRanges);
}
