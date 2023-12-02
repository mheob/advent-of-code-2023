import chalk from 'chalk';

import { type Day } from '../types';
import { currentYear, formatDay } from './common';

/**
 * Prints a message indicating that a specific day already exists.
 * @param day - The day that already exists.
 */
export function printAlreadyExistsMessage(day: Day) {
	console.log(chalk.red(`❌ Day ${day} already exists!`));
}

/**
 * Prints a message indicating that fetching the input failed and an empty file will be created.
 */
export function printFailedInputMessage() {
	console.log(chalk.red.bold('❌ Fetching input failed, empty file will be created.'));
}

/**
 * Prints a failed setup message.
 * @param error - The error object, if any.
 */
export function printFailedSetupMessage(error: Error | undefined) {
	console.log(chalk.red(error?.message ?? 'Failed to set up day'));
}

/**
 * Prints a fetching message to the console.
 */
export function printFetchingMessage() {
	console.log('📄 Fetching input...');
}

/**
 * Prints a message indicating that a specific day is missing.
 * @param day - The missing day.
 */
export function printMissingDayMessage(day: Day) {
	console.log(chalk.red(`Day ${formatDay(day)} does not exist!`));
}

/**
 * Prints a message indicating that the setup for a specific day is being performed.
 * @param day - The day for which the setup is being performed.
 */
export function printSettingUpMessage(day: Day) {
	console.log(`📂 Setting up day "${formatDay(day)}"...`);
}

/**
 * Prints a success message indicating that a specific day has been set up.
 * @param day - The day for which the setup is completed.
 */
export function printSuccessSetUpMessage(day: Day) {
	console.log(chalk.green.bold(`✅ Day "${formatDay(day)}" set up!`));
}

/**
 * Prints a message indicating that the selected day is invalid.
 */
export function printWrongDayMessage() {
	console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`);
	console.log(`🎅 To get started, try: ${chalk.cyan('bun day 1')}`);
}

/**
 * Prints a message indicating that the year must be between 2015 and the current year.
 */
export function printWrongYearMessage() {
	console.log(
		chalk.red(`📅 Year must be between ${chalk.bold(2015)} and ${chalk.bold(currentYear)}.`),
	);
}
