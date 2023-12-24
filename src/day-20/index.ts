// /* eslint-disable @typescript-eslint/no-explicit-any */
import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-20');

type Queue = [string, number, string];

type Module = {
	type: string;
	name: string;
	state: number;
	inputs: Map<string, number>;
	outputs: string[];
};

const ON = 1;
const OFF = 0;
const LOW = 0;
const HIGH = 1;

function getModules(lines: string[]) {
	return lines
		.map((line) => {
			const [[module_], outputs] = line.split(' -> ').map((string_) => string_.split(', '));
			const matches = module_.match(/([%&]?)([a-z]+)/);
			if (!matches) throw new Error(`Invalid module_: ${module_}`);
			const [_, type, name] = matches;
			return { type, name, outputs };
		})
		.reduce((map, module_) => map.set(module_.name, module_), new Map()) as Map<string, Module>;
}

function prepareModules(modules: Map<string, Module>) {
	[...modules.values()]
		.filter((module_) => module_.type === '&')
		.forEach((module_) => {
			const inputs = [...modules.values()]
				.filter((modi) => modi.outputs.includes(module_.name))
				.map((modi) => modi.name);
			module_.inputs = inputs.reduce((map, input) => map.set(input, LOW), new Map());
		});
}

function send(module_: Module, signal: number, counter: number[], queue: Queue[]) {
	queue.push(...module_.outputs.map((output: string) => [output, signal, module_.name] as Queue));
	counter[signal] += module_.outputs.length;
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	const modules = getModules(lines);
	prepareModules(modules);

	const ping = (counter: number[]) => {
		const queue: Queue[] = [['broadcaster', LOW, 'button']];
		counter[0]++;

		while (queue.length > 0) {
			const [destination, signal, source] = queue.shift() as Queue;

			const module_ = modules.get(destination);
			if (module_ === undefined) {
				continue;
			}
			if (module_.name === 'broadcaster') {
				send(module_, signal, counter, queue);
			} else if (module_.type === '%' && signal === LOW) {
				module_.state = module_.state ? OFF : ON;
				send(module_, module_.state, counter, queue);
			} else if (module_.type === '&') {
				module_.inputs.set(source, signal);
				const allHigh = ![...module_.inputs.values()].includes(LOW);
				const pulse = allHigh ? LOW : HIGH;
				send(module_, pulse, counter, queue);
			}
		}
	};

	const counter = [0, 0];
	for (let index = 0; index < 1000; index++) {
		ping(counter);
	}

	return counter[0] * counter[1];
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	const modules = getModules(lines);
	prepareModules(modules);

	let count = 0;
	const firstHigh: Record<string, number> = {};
	const secondHigh: Record<string, number> = {};

	const ping = (counter: number[]) => {
		const queue: Queue[] = [['broadcaster', LOW, 'button']];
		counter[0]++;

		while (queue.length > 0) {
			const [destination, signal, source] = queue.shift() as Queue;

			const zrInputs = modules.get('qn')!.inputs; // qn controls rx
			if ([...zrInputs.entries()].some(([key, value]) => destination === key && value === HIGH)) {
				if (!firstHigh[source]) {
					firstHigh[source] = count;
				} else if (count > firstHigh[source] && !secondHigh[source]) {
					secondHigh[source] = count;
				}
			}

			const module_ = modules.get(destination);
			if (module_ === undefined) {
				continue;
			}
			if (module_.name === 'broadcaster') {
				send(module_, signal, counter, queue);
			} else if (module_.type === '%' && signal === LOW) {
				module_.state = module_.state ? OFF : ON;
				send(module_, module_.state, counter, queue);
			} else if (module_.type === '&') {
				module_.inputs.set(source, signal);
				const allHigh = ![...module_.inputs.values()].includes(LOW);
				const pulse = allHigh ? LOW : HIGH;
				send(module_, pulse, counter, queue);
			}
		}
	};

	const counter = [0, 0];
	for (let index = 0; index < 1000; index++) {
		ping(counter);
	}

	// eslint-disable-next-line no-constant-condition
	while (true) {
		count++;
		ping(counter);
		if (Object.keys(secondHigh).length === 4) {
			break;
		}
	}

	const cycles = Object.entries(secondHigh).map(([key, value]) => value - firstHigh[key]);

	const greatestCommonDivisor = (a: number, b: number): number =>
		b ? greatestCommonDivisor(b, a % b) : a;
	const leastCommonMultiple = (a: number, b: number) => (a * b) / greatestCommonDivisor(a, b);

	return cycles.reduce((a, b) => leastCommonMultiple(a, b));
}
