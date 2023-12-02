import chalk from 'chalk';

import { daySchema } from '../types';
import { formatDayName } from '../utils/common';
import { printMissingDayMessage, printWrongDayMessage } from '../utils/log';
import { formatPerformance, withPerformance } from '../utils/performance';

/**
 * Runs the tasks for a specific day.
 *
 * The function first validates the day number using the `daySchema.parse` method.
 * If the day number is invalid, it calls the `printWrongDayMessage` function.
 *
 * It then checks if a file exists for the given day in the `./src` directory.
 * If the file does not exist, it calls the `printMissingDayMessage` function and returns.
 *
 * If the file exists, it imports the `part1` and `part2` tasks from the file
 * and runs them with performance measurement using the `withPerformance` function.
 *
 * Finally, it logs the results of `part1` and `part2` tasks along with their
 * performance measurements. If a task result is `null` or `undefined`,
 * it logs a dash ('—') instead.
 *
 * @param day - The day number to run tasks for.
 * @returns A Promise that resolves when the function has completed.
 * @throws Will throw an error if the `daySchema.parse` method throws an error.
 */
async function runDay(day: number) {
	try {
		daySchema.parse(day);
	} catch {
		printWrongDayMessage();
	}

	const file = Bun.file(`./src/${formatDayName(day)}/index.ts`);
	const fileExists = await file.exists();

	if (!fileExists) {
		printMissingDayMessage(day);
		return;
	}

	const { part1, part2 } = await import(`../${formatDayName(day)}/index.ts`);
	const [one, onePerformance] = await withPerformance(() => part1?.());
	const [two, twoPerformance] = await withPerformance(() => part2?.());

	console.log('🕯️', chalk.magenta(`Your result for ${chalk.bold(`day ${day}`)}:`));
	console.log(
		'🌲',
		'Part One:',
		chalk.green(one ?? '—'),
		one ? `(${formatPerformance(onePerformance)})` : '',
	);
	console.log(
		'🎄',
		'Part Two:',
		chalk.green(two ?? '—'),
		two ? `(${formatPerformance(twoPerformance)})` : '',
	);
}

try {
	const day = Number.parseInt(Bun.argv[2] ?? '');
	daySchema.parse(day);
	await runDay(day);
} catch {
	printWrongDayMessage();
}
