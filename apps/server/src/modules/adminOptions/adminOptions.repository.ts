import { type AdminOptions, AdminOptionsModel } from "@refugies-info/mongo";

export const getAdminOption = async (key: string) =>
  AdminOptionsModel.findOne({ key: key }).cacheQuery();

export const createAdminOption = async (adminOption: AdminOptions) =>
  AdminOptionsModel.create(adminOption);

export const updateAdminOption = async (key: string, value: unknown) =>
  AdminOptionsModel.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });

const WORDS_TRANSLATED_KEY = "nbWordsTranslated";

/** Read the pre-computed translated-words counter. Returns 0 if not yet initialised. */
export const getWordsTranslatedCounter = async (): Promise<number> => {
  const doc = await AdminOptionsModel.findOne({ key: WORDS_TRANSLATED_KEY }).cacheQuery();
  return (doc?.value as number) ?? 0;
};

/**
 * Atomically increment (positive delta) or decrement (negative delta) the counter.
 * Uses upsert so it is safe to call before the backfill migration has run.
 */
export const incrementWordsTranslatedCounter = async (delta: number): Promise<void> => {
  if (delta === 0) return;
  await AdminOptionsModel.findOneAndUpdate(
    { key: WORDS_TRANSLATED_KEY },
    { $inc: { value: delta } },
    { upsert: true, setDefaultsOnInsert: true },
  );
};
