import logger from "../logger";

export async function asyncForEach<T>(
  array: T[],
  callback: (arrayEntry: T, index: number, array: T[]) => Promise<void>
) {
  for (let index = 0; index < array.length; index++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    } catch (e) { logger.error("Error in asyncForEach", e) }
  }
}
