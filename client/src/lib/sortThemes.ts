import { Theme } from "types/interface";

export const sortThemes = (a: Theme, b: Theme) => (a.position > b.position ? 1 : -1)
