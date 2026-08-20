/**
 * @hameds/iran-country-divisions
 * تقسیمات کشوری ایران — داده‌های مرکز آمار ایران
 */

/**
 * نوع تقسیمات. این عدد فقط «نوع» را نشان می‌دهد، نه عمق در درخت.
 * عمق را از زنجیره parentId بگیرید: منطقه شهری (7) زیر شهر (5) قرار دارد.
 */
export declare const DivisionType: {
  readonly Country: 0;
  readonly Province: 1;
  readonly County: 2;
  readonly District: 3;
  readonly RuralDistrict: 4;
  readonly City: 5;
  readonly Village: 6;
  readonly UrbanZone: 7;
};

export type DivisionTypeValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export declare const DIVISION_TYPE_NAMES: Readonly<Record<DivisionTypeValue, string>>;

export interface Division {
  /** شناسه یکتا در همان سال. بین سال‌ها ثابت نیست. */
  id: number;
  /** شناسه والد. فقط برای کشور null است. */
  parentId: number | null;
  /** نام یکسان‌سازی‌شده با کاراکترهای استاندارد فارسی. */
  name: string;
  /** کد مرکز آمار. کد شهر ۴ رقمی و کد آبادی ۶ رقمی در کل کشور یکتاست. */
  code: string;
  type: DivisionTypeValue;
  typeName: string;
}

export interface DivisionNode extends Division {
  children?: DivisionNode[];
}

export interface SearchOptions {
  type?: DivisionTypeValue;
  /** حداکثر تعداد نتیجه. صفر یعنی بدون محدودیت. پیش‌فرض ۵۰. */
  limit?: number;
  /** تطبیق کامل نام به جای «شامل بودن». */
  exact?: boolean;
  /** نتیجه باید زیرمجموعه این شناسه باشد. */
  within?: number;
}

export declare class Divisions {
  readonly year: number;

  /** آبادی‌ها را بارگذاری می‌کند. متدهای دیگر خودشان در صورت نیاز صدا می‌زنند. */
  loadVillages(): this;

  get(id: number): Division | undefined;
  parent(id: number): Division | undefined;
  /** از کشور تا والد مستقیم. */
  ancestors(id: number): Division[];
  /** از کشور تا خود محل. */
  path(id: number): Division[];
  children(id: number, options?: { type?: DivisionTypeValue }): Division[];

  country(): Division | undefined;
  provinces(): Division[];
  /** فقط شهر. مناطق شهری در urbanZones هستند. */
  cities(parentId?: number): Division[];
  urbanZones(cityId?: number): Division[];
  villages(ruralDistrictId?: number): Division[];
  byType(type: DivisionTypeValue): Division[];

  search(query: string, options?: SearchOptions): Division[];
  tree(id: number, options?: { maxType?: DivisionTypeValue }): DivisionNode | undefined;
  counts(): Record<number, number>;
}

/** سال‌های موجود در این نسخه از پکیج. */
export declare function years(): number[];
/** جدیدترین سال موجود. */
export declare function latestYear(): number;
/** داده یک سال. بدون آرگومان، جدیدترین سال. */
export declare function load(year?: number | string): Divisions;
/** یکسان‌سازی نام برای مقایسه و جست‌وجو. */
export declare function foldName(value: string): string;

declare const _default: {
  DivisionType: typeof DivisionType;
  DIVISION_TYPE_NAMES: typeof DIVISION_TYPE_NAMES;
  Divisions: typeof Divisions;
  foldName: typeof foldName;
  latestYear: typeof latestYear;
  load: typeof load;
  years: typeof years;
};
export default _default;
