<div dir="rtl">

# @hameds/iran-country-divisions

تقسیمات کشوری ایران — استان، شهرستان، بخش، دهستان، شهر، منطقه شهری و آبادی — بر پایه داده‌های [مرکز آمار ایران](https://www.amar.org.ir/).

بدون هیچ وابستگی. ESM و CommonJS. تایپ TypeScript دارد.

## نصب

</div>

```bash
npm install @hameds/iran-country-divisions
```

<div dir="rtl">

## استفاده

</div>

```js
import { load, DivisionType } from "@hameds/iran-country-divisions";
// یا: const { load, DivisionType } = require("@hameds/iran-country-divisions");

const ir = load();          // جدیدترین سال موجود
// const ir = load(1404);   // یک سال مشخص

const tehran = ir.search("تهران", { type: DivisionType.Province })[0];
// { id: 25, parentId: 1, name: 'تهران', code: '23', type: 1, typeName: 'استان' }

ir.children(tehran.id);
// شهرستان‌های استان تهران

const arak = ir.search("اراک", { type: DivisionType.City, exact: true })[0];
ir.urbanZones(arak.id);
// [ اراک ۱، اراک ۲، اراک ۳، اراک ۴، اراک ۵ ]

ir.path(someVillageId).map((d) => d.name).join(" ← ");
// 'ایران ← تهران ← اسلامشهر ← احمدآباد مستوفی ← احمدآباد مستوفی ← ...'
```

<div dir="rtl">

## API

### `load(year?)`

داده یک سال را برمی‌گرداند. بدون آرگومان جدیدترین سال. نتیجه کش می‌شود، پس فراخوانی دوباره هزینه‌ای ندارد.

آبادی‌ها (۹۹ هزار ردیف) در بارگذاری اولیه خوانده **نمی‌شوند**. هر متدی که به آن‌ها نیاز داشته باشد خودش بارگذاری را انجام می‌دهد.

### متدهای پیمایش

| متد | خروجی |
|---|---|
| `get(id)` | یک محل |
| `parent(id)` | والد مستقیم |
| `ancestors(id)` | از کشور تا والد مستقیم |
| `path(id)` | از کشور تا خود محل |
| `children(id, { type })` | فرزندان مستقیم |
| `tree(id, { maxType })` | کل زیردرخت به صورت تودرتو |

### متدهای دسته‌ای

| متد | خروجی |
|---|---|
| `country()` | ریشه درخت |
| `provinces()` | ۳۱ استان |
| `cities(parentId?)` | شهرها. **مناطق شهری در این فهرست نیستند.** |
| `urbanZones(cityId?)` | مناطق شهری |
| `villages(ruralDistrictId?)` | آبادی‌ها |
| `byType(type)` | همه محل‌های یک نوع |
| `counts()` | تعداد هر نوع |

### `search(query, options)`

جست‌وجوی نام. `ی` و `ک` عربی، اعراب، فاصله، نیم‌فاصله و ارقام فارسی نادیده گرفته می‌شوند، پس `كرمانشاه` و `کرمانشاه` یک نتیجه می‌دهند.

</div>

```js
ir.search("آباد", {
  type: DivisionType.Village,  // فقط یک نوع
  limit: 100,                  // پیش‌فرض ۵۰. صفر یعنی بدون محدودیت.
  exact: false,                // تطبیق کامل نام به جای «شامل بودن»
  within: tehran.id,           // فقط زیرمجموعه‌های این شناسه
});
```

<div dir="rtl">

### `DivisionType`

</div>

```js
DivisionType.Country        // 0
DivisionType.Province       // 1
DivisionType.County         // 2
DivisionType.District       // 3
DivisionType.RuralDistrict  // 4
DivisionType.City           // 5
DivisionType.Village        // 6
DivisionType.UrbanZone      // 7
```

<div dir="rtl">

⚠️ این عدد فقط **نوع** را نشان می‌دهد، نه **عمق** در درخت. منطقه شهری (`7`) زیر شهر (`5`) قرار دارد. برای عمق از `path()` یا `ancestors()` استفاده کنید.

### دسترسی مستقیم به فایل داده

</div>

```js
import core from "@hameds/iran-country-divisions/data/1404/core.json" with { type: "json" };
// { year: 1404, fields: ["id","parentId","name","code","type"], rows: [[...], ...] }
```

<div dir="rtl">

## نکته درباره شناسه‌ها

شناسه `id` فقط در همان سال معتبر است و بین سال‌ها ثابت نمی‌ماند. اگر شناسه‌ها را در دیتابیس خودتان ذخیره می‌کنید، برای ارتقاء از جدول نگاشت `migrations/` در مخزن استفاده کنید.

کد چهار رقمی **شهر** و کد شش رقمی **آبادی** در کل کشور یکتا هستند و بین سال‌ها پایدارترند.

## مجوز

این پکیج با مجوز MIT منتشر می‌شود. داده‌ها از مرکز آمار ایران.

</div>
