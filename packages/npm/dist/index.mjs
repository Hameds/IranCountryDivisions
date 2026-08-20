// پوسته ESM روی پیاده‌سازی CommonJS. منطق فقط در index.cjs است.
import mod from "./index.cjs";

export const DivisionType = mod.DivisionType;
export const DIVISION_TYPE_NAMES = mod.DIVISION_TYPE_NAMES;
export const Divisions = mod.Divisions;
export const foldName = mod.foldName;
export const latestYear = mod.latestYear;
export const load = mod.load;
export const years = mod.years;

export default mod;
