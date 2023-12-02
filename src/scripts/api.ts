/**
 * Fetches the input for a specific day of the Advent of Code challenge.
 * @param options - The options for fetching the input.
 * @param options.day - The day of the challenge.
 * @param [options.year] - The year of the challenge. If not provided, the current year is used.
 * @returns A promise that resolves to the input string.
 */
export async function fetchInput({ day, year }: { day: number; year?: number }) {
	try {
		year ??= new Date().getFullYear();
		const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
			headers: { Cookie: `session=${Bun.env.SESSION}` },
		});
		if (!response.ok) throw new Error(response.statusText);
		return await response.text();
	} catch (error) {
		console.error('Error:', error);
	}
}
