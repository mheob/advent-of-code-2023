import type { DayName } from '../types';

type Transform<Response, Input = string> = (s: Input) => Response;

async function readFile(filepath: string) {
	const file = Bun.file(filepath);
	const text = await file.text();
	return text.trim();
}

export async function readInput(directory: DayName, fileName: string = 'input') {
	const filepath = `./src/${directory}/${fileName}.txt`;
	return readFile(filepath);
}

export async function parseLines<T = string>(
	input: string,
	as?: Transform<T>,
	{ includeEmpty = false }: { includeEmpty?: boolean } = {},
) {
	let lines = input.split('\n');
	if (!includeEmpty) {
		lines = lines.filter(Boolean);
	}
	// eslint-disable-next-line unicorn/no-array-callback-reference
	return as ? lines.map(as) : (lines as T[]);
}
