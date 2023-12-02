import { z } from 'zod';

/**
 * Represents the year of the Advent of Code challenge.
 *
 * It is a number schema that should be an integer between 2015 and the current year.
 */
export const yearSchema = z
	.number()
	.int()
	.min(2015)
	.max(Number.parseInt(Bun.env.YEAR ?? new Date().getFullYear().toString()));

/**
 * Represents the year of the Advent of Code challenge.
 *
 * It can be any number from 2015 to the current year.
 */
export type Year = z.infer<typeof yearSchema>;

/**
 * Represents the day of the Advent of Code challenge.
 *
 * It is a number schema that should be an integer between 1 and 25.
 */
export const daySchema = z.number().int().min(1).max(25);

/**
 * Represents the day of the Advent of Code challenge.
 *
 * It can be any number from 1 to 25.
 */
export type Day = z.infer<typeof daySchema>;

type DayPrefix = 'day-';
type DayAsString =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25';

/**
 * Represents the name of a day in Advent of Code.
 * It is a string literal type with this format: `day-01` to `day-25`.
 */
export type DayName = `${DayPrefix}${DayAsString}`;
