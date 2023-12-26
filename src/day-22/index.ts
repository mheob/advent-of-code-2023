import { sum } from '../utils/common';
import { parseLines, readInput } from '../utils/io';

type Vector3 = { x: number; y: number; z: number };

const input = await readInput('day-22');
const lines = await parseLines(input);

const bricks = lines
	.filter(Boolean)
	.map((line) => line.split('~'))
	.map(([from, to]) => ({
		from: from.split(',').map((index) => Number.parseInt(index)),
		to: to.split(',').map((index) => Number.parseInt(index)),
	}))
	.map(({ from, to }) => {
		const cubes = [] as Vector3[];
		for (let x = Math.min(from[0], to[0]); x <= Math.max(from[0], to[0]); x++) {
			for (let y = Math.min(from[1], to[1]); y <= Math.max(from[1], to[1]); y++) {
				for (let z = Math.min(from[2], to[2]); z <= Math.max(from[2], to[2]); z++) {
					cubes.push({ x, y, z });
				}
			}
		}
		return cubes;
	});

function isSupporting(bottomBrick: Vector3[], topBrick: Vector3[]) {
	return topBrick.some((topCube) =>
		bottomBrick.some(
			(bottomCube) =>
				bottomCube.x === topCube.x && bottomCube.y === topCube.y && bottomCube.z === topCube.z - 1,
		),
	);
}

let settled = false;
while (!settled) {
	settled = true;

	bricks.forEach((brick) => {
		if (brick.some((c) => c.z === 1)) return;

		if (!bricks.some((b) => b !== brick && isSupporting(b, brick))) {
			brick.forEach((c) => c.z--);
			settled = false;
		}
	});
}

function couldBeDisintegrated(brick: Vector3[]) {
	return bricks.every((other) => {
		if (other === brick) return true;
		if (other.some((c) => c.z === 1)) return true;
		return bricks.some((b) => b !== other && b !== brick && isSupporting(b, other));
	});
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	return bricks.filter((b) => couldBeDisintegrated(b)).length;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	return sum(
		bricks.map((_brickToBeDisintegrated, index) => {
			const bricksClone = JSON.parse(JSON.stringify(bricks)) as Vector3[][];
			bricksClone.splice(index, 1);
			const hasMoved = new Set<Vector3[]>();

			let settled = false;
			while (!settled) {
				settled = true;

				if (hasMoved.size === bricksClone.length) break; // further falling not important for part 2

				bricksClone.forEach((brick) => {
					if (brick.some((c) => c.z === 1)) return;

					if (!bricksClone.some((b) => b !== brick && isSupporting(b, brick))) {
						hasMoved.add(brick);
						brick.forEach((c) => c.z--);
						settled = false;
					}
				});
			}

			return hasMoved.size;
		}),
	);
}
