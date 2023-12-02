# 🎄 Advent of Code Template

- **Bun & TypeScript**
- Automatic day setup
- Puzzle input automatically fetched
- Performance metrics

This template is strongly inspired by the template from [matijaoe](https://github.com/matijaoe/advent-of-code/).\
Thanks for your inspiration!

## Setup

Ensure [`bun`](https://bun.sh/) is installed:

```sh
bun -v
```

if not installed, run this:

```sh
curl -fsSL https://bun.sh/install | bash
```

Install dependencies:

```sh
bun install
```

Set up a new day:

```sh
bun setup 1
```

Run day solutions:

```sh
bun day 1
```

For automatic puzzle input retrieval, define `.env` file with `session` cookie from [adventofcode.com](https://adventofcode.com):

```env
SESSION=
YEAR=2023
```

## Structure

Generated day structure:

```ts
import { parseLines, readInput } from 'io';

const input = await readInput('day-01');

export const part1 = () => {
	const lines = parseLines(input);
	// your code goes here
	return lines.length;
};
```

`bun day <day-num>` output:

```text
🌲 Part One: 70698 (1.11 ms)
🎄 Part Two: 140471 (383.5 µs)
```

## Days

✅ / ❌

| Day | Part 1 | Part 2 |           Solution            |              Advent of Code link               |
| :-: | :----: | :----: | :---------------------------: | :--------------------------------------------: |
| 01  |   ✅   |   ❌   | [Link](./src/day-01/index.ts) | [Day 01](https://adventofcode.com/2023/day/1)  |
| 02  |        |        |                               | [Day 02](https://adventofcode.com/2023/day/2)  |
| 03  |        |        |                               | [Day 03](https://adventofcode.com/2023/day/3)  |
| 04  |        |        |                               | [Day 04](https://adventofcode.com/2023/day/4)  |
| 05  |        |        |                               | [Day 05](https://adventofcode.com/2023/day/5)  |
| 06  |        |        |                               | [Day 06](https://adventofcode.com/2023/day/6)  |
| 07  |        |        |                               | [Day 07](https://adventofcode.com/2023/day/7)  |
| 08  |        |        |                               | [Day 08](https://adventofcode.com/2023/day/8)  |
| 09  |        |        |                               | [Day 09](https://adventofcode.com/2023/day/9)  |
| 10  |        |        |                               | [Day 10](https://adventofcode.com/2023/day/10) |
| 11  |        |        |                               | [Day 11](https://adventofcode.com/2023/day/11) |
| 12  |        |        |                               | [Day 12](https://adventofcode.com/2023/day/12) |
| 13  |        |        |                               | [Day 13](https://adventofcode.com/2023/day/13) |
| 14  |        |        |                               | [Day 14](https://adventofcode.com/2023/day/14) |
| 15  |        |        |                               | [Day 15](https://adventofcode.com/2023/day/15) |
| 16  |        |        |                               | [Day 16](https://adventofcode.com/2023/day/16) |
| 17  |        |        |                               | [Day 17](https://adventofcode.com/2023/day/17) |
| 18  |        |        |                               | [Day 18](https://adventofcode.com/2023/day/18) |
| 19  |        |        |                               | [Day 19](https://adventofcode.com/2023/day/19) |
| 20  |        |        |                               | [Day 20](https://adventofcode.com/2023/day/20) |
| 21  |        |        |                               | [Day 21](https://adventofcode.com/2023/day/21) |
| 22  |        |        |                               | [Day 22](https://adventofcode.com/2023/day/22) |
| 23  |        |        |                               | [Day 23](https://adventofcode.com/2023/day/23) |
| 24  |        |        |                               | [Day 24](https://adventofcode.com/2023/day/24) |
| 25  |        |        |                               | [Day 25](https://adventofcode.com/2023/day/25) |
