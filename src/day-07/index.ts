import { parseLines, readInput } from '../utils/io';

const input = await readInput('day-07');

function getHands(lines: string[]) {
	return lines
		.map((line) => line.trim().split(/\s+/))
		.map(
			([hand, bid]) =>
				[
					hand,
					[...hand].reduce((map, card) => {
						map.set(card, (map.get(card) || 0) + 1);
						return map;
					}, new Map<string, number>()),
					Number(bid),
				] as [string, Map<string, number>, number],
		);
}

function sortCards(map: Map<string, number>) {
	return [...map.entries()].toSorted((a, b) => b[1] - a[1]);
}

function getHighestCard(handA: string[], handB: string[], cards: Record<string, number>): number {
	return (cards[handA[0]] || Number(handA[0])) === (cards[handB[0]] || Number(handB[0]))
		? getHighestCard(handA.slice(1), handB.slice(1), cards)
		: (cards[handA[0]] || Number(handA[0])) - (cards[handB[0]] || Number(handB[0]));
}

// ############################################################
// ------------------------- Part 1 ---------------------------
// ############################################################

const CARDS_PART_1: Record<string, number> = {
	A: 14,
	K: 13,
	Q: 12,
	J: 11,
	T: 10,
};

function getSortedHands_part1(hands: ReturnType<typeof getHands>, cards: Record<string, number>) {
	return hands.toSorted((a, b) => {
		const topA = sortCards(a[1])[0][1];
		const topB = sortCards(b[1])[0][1];

		if (topA !== topB) return topA - topB;

		const secondTopA = sortCards(a[1])[1]?.[1] ?? 0;
		const secondTopB = sortCards(b[1])[1]?.[1] ?? 0;

		if ((topA === 2 || topA === 3) && secondTopA !== secondTopB) {
			return secondTopA - secondTopB;
		}

		return getHighestCard([...a[0]], [...b[0]], cards);
	});
}

export async function part1() {
	const lines = await parseLines(input);

	const hands = getHands(lines);
	const sorted = getSortedHands_part1(hands, CARDS_PART_1);

	const sum = sorted.reduce(
		(accumulator, [_a, _b, bid], index) => accumulator + bid * (index + 1),
		0,
	);

	return sum;
}

// ############################################################
// ------------------------- Part 2 ---------------------------
// ############################################################

const CARDS_PART_2: Record<string, number> = {
	A: 14,
	K: 13,
	Q: 12,
	J: 1,
	T: 10,
};

function updateMapForJokers(handData: [string, Map<string, number>, number], cardNotJoker: string) {
	const jokerCount = handData[1].get('J') ?? 0;
	const cardCount = handData[1].get(cardNotJoker) ?? 0;
	return new Map(
		[...handData[1]].map(([card, count]) =>
			card === 'J' || card === cardNotJoker
				? [cardNotJoker, jokerCount + cardCount]
				: [card, count],
		),
	);
}

function getGreatestCardNotJoker(map: Map<string, number>) {
	return [...map.entries()].toSorted((a, b) => b[1] - a[1]).find(([card]) => card !== 'J')?.[0];
}

function getSortedHands_part2(hands: ReturnType<typeof getHands>, cards: Record<string, number>) {
	return hands.toSorted((a_, b_) => {
		const a: [string, Map<string, number>, number] = a_[0].includes('J')
			? [a_[0], updateMapForJokers(a_, getGreatestCardNotJoker(a_[1]) ?? ''), a_[2]]
			: a_;
		const b: [string, Map<string, number>, number] = b_[0].includes('J')
			? [b_[0], updateMapForJokers(b_, getGreatestCardNotJoker(b_[1]) ?? ''), b_[2]]
			: b_;

		const topA = sortCards(a[1])[0][1];
		const topB = sortCards(b[1])[0][1];

		if (topA !== topB) return topA - topB;

		const secondTopA = sortCards(a[1])[1]?.[1] ?? 0;
		const secondTopB = sortCards(b[1])[1]?.[1] ?? 0;

		if ((topA === 2 || topA === 3) && secondTopA !== secondTopB) {
			return secondTopA - secondTopB;
		}

		return getHighestCard([...a[0]], [...b[0]], cards);
	});
}
export async function part2() {
	const lines = await parseLines(input);

	const hands = getHands(lines);
	const sorted = getSortedHands_part2(hands, CARDS_PART_2);

	const sum = sorted.reduce(
		(accumulator, [_a, _b, bid], index) => accumulator + bid * (index + 1),
		0,
	);

	return sum;
}
