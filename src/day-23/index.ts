import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-23');

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);
	const data = lines.map((line) => [...line]);

	const start = { x: 1, y: 0, path: ['1,0'] };
	const directories: { [key: string]: [number, number, string] } = {
		'>': [1, 0, '<'],
		'<': [-1, 0, '>'],
		'^': [0, -1, 'v'],
		v: [0, 1, '^'],
	};
	const queue = [start];
	let longestPath = [];

	while (queue.length > 0) {
		const pos = queue.shift()!;

		if (pos.x === data[0].length - 2 && pos.y === data.length - 1) {
			if (longestPath.length < pos.path.length) {
				longestPath = pos.path;
			}
			continue;
		}

		if ('><v^'.includes(data[pos.y][pos.x])) {
			const newPos = {
				x: pos.x + directories[data[pos.y][pos.x]][0],
				y: pos.y + directories[data[pos.y][pos.x]][1],
				path: [...pos.path],
			};
			newPos.path.push(`${newPos.x},${newPos.y}`);
			queue.push(newPos);
			continue;
		}

		for (const directory of Object.keys(directories)) {
			const newPos = {
				x: pos.x + directories[directory][0],
				y: pos.y + directories[directory][1],
				path: [...pos.path],
			};

			if (
				!pos.path.includes(`${newPos.x},${newPos.y}`) &&
				newPos.x >= 0 &&
				newPos.x < data[0].length &&
				newPos.y >= 0 &&
				newPos.y < data.length &&
				data[newPos.y][newPos.x] !== '#' &&
				data[newPos.y][newPos.x] !== directories[directory][2]
			) {
				newPos.path.push(`${newPos.x},${newPos.y}`);
				queue.push(newPos);
			}
		}
	}

	return longestPath.length - 1;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	const data = lines.map((line) => [...line]);

	const size = data.length;
	const directories = [
		[1, 0],
		[-1, 0],
		[0, -1],
		[0, 1],
	];
	const start = { x: 1, y: 0 };
	const end = { x: size - 2, y: size - 1 };

	// find intersections
	const intersections = [
		{ x: start.x, y: start.y },
		{ x: end.x, y: end.y },
	];
	for (let index = 1; index < size - 1; index++) {
		for (let index_ = 1; index_ < size - 1; index_++) {
			if (data[index][index_] === '#') continue;

			let neighbours = 0;
			for (const directory of directories) {
				const [nX, nY] = [index_ + directory[0], index + directory[1]];
				if (nX >= 1 && nX < size - 1 && nY >= 1 && nY < size - 1 && data[nY][nX] !== '#') {
					neighbours++;
				}
			}

			if (neighbours >= 3) {
				intersections.push({ x: index_, y: index });
			}
		}
	}

	// get distances between intersections
	const intersectionDistances: { [key: string]: { [key: string]: number } } = {};

	for (const intersect of intersections) {
		intersectionDistances[`${intersect.x},${intersect.y}`] = {};
		const queue = [{ ...intersect, len: 0 }];
		const visited = [`${intersect.x},${intersect.y}`];

		while (queue.length > 0) {
			const pos = queue.shift()!;

			for (const directory of directories) {
				const [nX, nY] = [pos.x + directory[0], pos.y + directory[1]];
				if (
					!visited.includes(`${nX},${nY}`) &&
					nX >= 0 &&
					nX < size &&
					nY >= 0 &&
					nY < size &&
					data[nY][nX] !== '#'
				) {
					visited.push(`${nX},${nY}`);
					const findIntersection = intersections.find(
						(element) => element.x === nX && element.y === nY,
					);
					if (findIntersection) {
						intersectionDistances[`${intersect.x},${intersect.y}`][
							`${findIntersection.x},${findIntersection.y}`
						] = pos.len + 1;
						continue;
					}
					queue.push({ x: nX, y: nY, len: pos.len + 1 });
				}
			}
		}
	}

	// get longest path
	const visited = new Set();

	function dfs(pos: string) {
		const [posX, posY] = pos.split(',').map((element) => +element);
		if (posX === end.x && posY === end.y) return 0;

		let longestPath = 0;

		visited.add(`${posX},${posY}`);

		for (const nextIntersection of Object.keys(intersectionDistances[`${posX},${posY}`])) {
			if (!visited.has(nextIntersection)) {
				longestPath = Math.max(
					longestPath,
					dfs(nextIntersection) + intersectionDistances[`${posX},${posY}`][nextIntersection],
				);
			}
		}

		visited.delete(`${posX},${posY}`);

		return longestPath;
	}

	return dfs('1,0');
}
