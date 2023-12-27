import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-25');

function buildGraph(input: string[]) {
	const vertices: string[] = [];
	const edges: string[][] = [];

	const addToVertices = (vertex: string) => {
		!vertices.includes(vertex) && vertices.push(vertex);
	};

	input.forEach((line) => {
		const [component, connectedString] = line.split(': ');
		const connected = connectedString.split(' ');

		addToVertices(component);
		connected.forEach((c) => addToVertices(c));

		connected.forEach((c) => !hasEdge(component, c) && edges.push([component, c]));
	});

	function hasEdge(vertex1: string, vertex2: string) {
		return edges.some(
			(edge) =>
				(edge[0] === vertex1 && edge[1] === vertex2) ||
				(edge[0] === vertex2 && edge[1] === vertex1),
		);
	}

	return { vertices, edges };
}

function countCuts(subsets: string[][], edges: string[][]): number {
	let cuts = 0;

	for (const edge of edges) {
		const subset1 = subsets.find((s) => s.includes(edge[0])) || [];
		const subset2 = subsets.find((s) => s.includes(edge[1])) || [];

		if (subset1 !== subset2) ++cuts;
	}

	return cuts;
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

export async function part1() {
	const lines = await parseLines(input);

	const { vertices, edges } = buildGraph(lines);
	let subsets: string[][] = [];
	let subset1: string[], subset2: string[];

	do {
		subsets = [];

		for (const vertex of vertices) {
			subsets.push([vertex]);
		}

		while (subsets.length > 2) {
			const randIndex = Math.floor(Math.random() * edges.length);

			subset1 = subsets.find((s) => s.includes(edges[randIndex][0])) || [];
			subset2 = subsets.find((s) => s.includes(edges[randIndex][1])) || [];

			if (subset1 === subset2) continue;

			subsets = subsets.filter((s) => s !== subset2);
			subset1.push(...subset2);
		}
	} while (countCuts(subsets, edges) !== 3);

	return subsets.reduce((a, b) => a * b.length, 1);
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

export async function part2() {
	const lines = await parseLines(input);
	// TODO: add your code goes here
	return lines.length;
}
