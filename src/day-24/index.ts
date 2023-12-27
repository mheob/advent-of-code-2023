// import { init } from 'z3-solver';

import { readInput } from '../utils/io';

const input = await readInput('day-24');
// const input = await readInput('day-24', 'example');

type Coord3d = { x: number; y: number; z: number };
type Velocity3d = { dx: number; dy: number; dz: number };
type Area = { minX: number; minY: number; maxX: number; maxY: number };

type ObjectMotion = { start: { x: number; y: number }; velocity: { dx: number; dy: number } };
type Hailstone = { position: Coord3d; velocity: Velocity3d };

let hailstones: Hailstone[] = [];

function prepData(data: string[]): void {
	hailstones = data.map((line) => {
		const [pos, vel] = line.trim().split(' @ ');
		const [x, y, z] = pos.split(', ').map((n) => Number.parseInt(n.trim()));
		const [dx, dy, dz] = vel.split(', ').map((n) => Number.parseInt(n.trim()));

		return {
			position: {
				x,
				y,
				z,
			},
			velocity: {
				dx,
				dy,
				dz,
			},
		};
	});
}

function getSlopeIntercept(
	{ x, y }: { x: number; y: number },
	{ dx, dy }: { dx: number; dy: number },
) {
	const slope = dy / dx;
	const intercept = y - slope * x;
	return [slope, intercept];
}

function findFutureIntersection(
	object1: ObjectMotion,
	object2: ObjectMotion,
): { x: number; y: number } | null {
	const [slope1, intercept1] = getSlopeIntercept(object1.start, object1.velocity);
	const [slope2, intercept2] = getSlopeIntercept(object2.start, object2.velocity);

	if (slope1 === slope2) return null;

	const x = (intercept2 - intercept1) / (slope1 - slope2);
	const y = slope1 * x + intercept1;
	const t1 = (x - object1.start.x) / object1.velocity.dx;
	const t2 = (x - object2.start.x) / object2.velocity.dx;

	if (t1 < 0 || t2 < 0) return null;

	return { x, y };
}

function willPathsIntersect(object1: ObjectMotion, object2: ObjectMotion, area: Area): boolean {
	const point = findFutureIntersection(object1, object2);

	if (!point) return false;

	return (
		point.x >= area.minX && point.x <= area.maxX && point.y >= area.minY && point.y <= area.maxY
	);
}

function checkCollisionsInArea(area: Area) {
	const checked = new Set<string>();
	let intersected = 0;
	for (let index = 0; index < hailstones.length; index++) {
		for (let index_ = 0; index_ < hailstones.length; index_++) {
			if (index === index_) continue;

			if (checked.has(`${index}|${index_}`) || checked.has(`${index_}|${index}`)) continue;

			checked.add(`${index}|${index_}`);
			const a = hailstones[index];
			const b = hailstones[index_];

			if (
				willPathsIntersect(
					{ start: a.position, velocity: a.velocity },
					{ start: b.position, velocity: b.velocity },
					area,
				)
			)
				intersected++;
		}
	}
	return intersected;
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	prepData(input.split('\n'));
	// const area = {
	// 	minX: 7,
	// 	minY: 7,
	// 	maxX: 27,
	// 	maxY: 27,
	// };
	const area = {
		minX: 200_000_000_000_000,
		minY: 200_000_000_000_000,
		maxX: 400_000_000_000_000,
		maxY: 400_000_000_000_000,
	};
	return checkCollisionsInArea(area);
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	return 0;
	// prepData(input.split('\n'));
	// const { Context } = await init();
	// const { Solver, Eq, GE, Real } = Context('main');
	// const solver = new Solver();

	// const bv = (s: string) => Real.const(s);

	// const x = bv('x');
	// const y = bv('y');
	// const z = bv('z');

	// const dx = bv('dx');
	// const dy = bv('dy');
	// const dz = bv('dz');

	// hailstones.slice(0, 3).forEach((hailstone, index) => {
	// 	const { position, velocity } = hailstone;
	// 	const tk = bv(`tk${index}`);
	// 	solver.add(GE(tk, 0));
	// 	solver.add(Eq(x.add(dx.mul(tk)), tk.mul(velocity.dx).add(position.x)));
	// 	solver.add(Eq(y.add(dy.mul(tk)), tk.mul(velocity.dy).add(position.y)));
	// 	solver.add(Eq(z.add(dz.mul(tk)), tk.mul(velocity.dz).add(position.z)));
	// });

	// const solved = await solver.check();
	// if (solved === 'unsat') throw new Error('Unable to solve');

	// const model = solver.model();
	// const xResult = model.eval(x);
	// const yResult = model.eval(y);
	// const zResult = model.eval(z);

	// return Number(xResult.sexpr()) + Number(yResult.sexpr()) + Number(zResult.sexpr());
}
