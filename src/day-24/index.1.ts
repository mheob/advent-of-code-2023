import { init } from 'z3-solver';

import { readInput } from '../utils/io';

const { Context, em } = await init();
const Z3 = Context('main');

// const input = await readInput('day-24');
const input = await readInput('day-24', 'example');

// const range = [200_000_000_000_000, 400_000_000_000_000];
const range = [7, 27];

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const hailstones = input.split('\n').map((line) => line.match(/-?\d+/g)!.map(Number));

	let count = 0;
	for (let index = 0; index < hailstones.length - 1; index++) {
		const [x1, y1, _z1, vx1, vy1, _vz1] = hailstones[index];
		for (let index_ = index + 1; index_ < hailstones.length; index_++) {
			const [x2, y2, _z2, vx2, vy2, _vz2] = hailstones[index_];
			const t2 = (y1 - y2 + (vy1 * (x2 - x1)) / vx1) / (vy2 - (vy1 * vx2) / vx1);
			const t1 = (y2 - y1 + (vy2 * (x1 - x2)) / vx2) / (vy1 - (vy2 * vx1) / vx2);
			const x = x2 + vx2 * t2;
			const y = y2 + vy2 * t2;
			if (t1 > 0 && t2 > 0 && x >= range[0] && x <= range[1] && y >= range[0] && y <= range[1]) {
				count++;
			}
		}
	}

	return count;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const hailstones = input.split('\n').map((line) => line.match(/-?\d+/g)!.map(Number));

	const solver = new Z3.Solver();
	const x = Z3.Int.const('x');
	const y = Z3.Int.const('y');
	const z = Z3.Int.const('z');
	const vx = Z3.Int.const('vx');
	const vy = Z3.Int.const('vy');
	const vz = Z3.Int.const('vz');
	// system of equations solvable after 3
	for (let index = 0; index < 3; index++) {
		const [x1, y1, z1, vx1, vy1, vz1] = hailstones[index];

		// 9 equations, 9 unknowns
		// x + vx * t1 = x1 + vx1 * t1
		// y + vy * t1 = y1 + vy1 * t1
		// z + vz * t1 = z1 + vz1 * t1
		// x + vx * t2 = x2 + vx2 * t2
		// y + vy * t2 = y2 + vy2 * t2
		// z + vz * t2 = z2 + vz2 * t2
		// x + vx * t3 = x3 + vx3 * t3
		// y + vy * t3 = y3 + vy3 * t3
		// z + vz * t3 = z3 + vz3 * t3
		const t = Z3.Int.const(`t${index}`);
		solver.add(x.add(vx.mul(t)).eq(t.mul(vx1).add(x1)));
		solver.add(y.add(vy.mul(t)).eq(t.mul(vy1).add(y1)));
		solver.add(z.add(vz.mul(t)).eq(t.mul(vz1).add(z1)));
	}
	await solver.check();
	const model = solver.model();

	return [x, y, z].map((p) => +model.get(p).toString()).reduce((accumulator, n) => accumulator + n);
}

em.PThread.terminateAllThreads();
