import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-10');
// const input = await readInput('day-10', 'example');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function key(...items: any) {
	// eslint-disable-next-line prefer-rest-params
	return [...(typeof items === 'object' ? items : arguments)].join(':');
}

function findPipe(above: boolean, below: boolean, before: boolean, after: boolean) {
	return above ? (after ? 'L' : before ? 'J' : '|') : below ? (after ? 'F' : '7') : '-';
}

async function shared(lines: string[][]) {
	const sY = lines.findIndex((line) => line.includes('S'));
	const sX = lines[sY].indexOf('S');

	const maxY = lines.length - 1;
	const maxX = lines[0].length - 1;

	lines[sY][sX] = findPipe(
		sY > 0 && ['7', '|', 'F'].includes(lines[sY - 1][sX]),
		sY < maxY && ['J', '|', 'L'].includes(lines[sY + 1][sX]),
		sX > 0 && ['L', '-', 'F'].includes(lines[sY][sX - 1]),
		sX < maxX && ['7', '-', 'J'].includes(lines[sY][sX + 1]),
	);

	const walk = (y: number, x: number) => {
		const visited = new Set();
		// eslint-disable-next-line no-constant-condition
		while (true) {
			visited.add(key(y, x));
			if (y > 0 && ['J', '|', 'L'].includes(lines[y][x]) && !visited.has(key(y - 1, x))) {
				y--;
			} else if (y < maxY && ['7', '|', 'F'].includes(lines[y][x]) && !visited.has(key(y + 1, x))) {
				y++;
			} else if (x > 0 && ['J', '-', '7'].includes(lines[y][x]) && !visited.has(key(y, x - 1))) {
				x--;
			} else if (x < maxX && ['L', '-', 'F'].includes(lines[y][x]) && !visited.has(key(y, x + 1))) {
				x++;
			} else {
				return visited;
			}
		}
	};

	const path = walk(sY, sX);

	return path;
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const parsedLines = await parseLines(input);
	const lines = parsedLines.map((line) => [...line].map((line) => line));

	const path = await shared(lines);
	return path.size / 2;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const parsedLines = await parseLines(input);
	const lines = parsedLines.map((line) => [...line].map((line) => line));

	const path = await shared(lines);

	let countInside = 0;
	for (let y = 0, inside: string | boolean = false; y < lines.length; y++) {
		[...lines[y]].forEach((ch, x) => {
			if (path.has(key(y, x))) {
				switch (inside) {
					case 'above': {
						inside = ch === 'J' ? false : ch === '7' ? true : 'above';
						break;
					}
					case 'below': {
						inside = ch === 'J' ? true : ch === '7' ? false : 'below';
						break;
					}
					case true: {
						inside = ch === 'F' ? 'above' : ch === 'L' ? 'below' : false;
						break;
					}
					default: {
						inside = ch === 'F' ? 'below' : ch === 'L' ? 'above' : true;
					}
				}
			} else if (inside) {
				countInside++;
			}
		});
	}

	return countInside;
}
