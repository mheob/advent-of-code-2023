import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

import { type Day, daySchema, yearSchema } from '../types';
import { currentYear, formatDayName, generateTemplate } from '../utils/common';
import {
	printAlreadyExistsMessage,
	printFailedInputMessage,
	printFailedSetupMessage,
	printFetchingMessage,
	printSettingUpMessage,
	printSuccessSetUpMessage,
	printWrongDayMessage,
	printWrongYearMessage,
} from '../utils/log';
import { fetchInput } from './api';

/**
 * Setup a new day for the Advent of Code challenge.
 *
 * The function first constructs a directory URL using the provided day.
 * If the directory already exists, it prints a message and returns.
 *
 * It then attempts to parse the current year. If the year is invalid,
 * it prints a message.
 *
 * The function then prints a fetching message and attempts to fetch the input
 * for the provided day and year. If the fetch fails, it prints a message.
 *
 * The function then prints a setting up message and attempts to create the
 * directory and write the input and a generated template to files in the directory.
 * If any of these operations fail, it prints a message.
 *
 * If all operations are successful, it prints a success message.
 *
 * @param day - The day to be set up.
 * @returns A Promise that resolves when the function has completed.
 * @throws If any operations fail, an error is thrown.
 */
async function setupDay(day: Day) {
	const directory = new URL(`../${formatDayName(day)}/`, import.meta.url);

	if (existsSync(directory)) {
		printAlreadyExistsMessage(day);
		return;
	}

	try {
		yearSchema.parse(currentYear);
	} catch {
		printWrongYearMessage();
	}

	printFetchingMessage();
	let input: string | undefined;
	try {
		input = await fetchInput({ day, year: currentYear });
	} catch {
		printFailedInputMessage();
	}

	printSettingUpMessage(day);
	try {
		await mkdir(directory);
		await Promise.all([
			Bun.write(new URL('input.txt', directory.href), input ?? ''),
			Bun.write(new URL('index.ts', directory.href), generateTemplate(day)),
		]);
		printSuccessSetUpMessage(day);
	} catch (error) {
		printFailedSetupMessage(error as Error);
	}
}

try {
	const day = Number.parseInt(Bun.argv[2] ?? '') ?? new Date().getDate();
	daySchema.parse(day);
	await setupDay(day);
} catch {
	printWrongDayMessage();
}
