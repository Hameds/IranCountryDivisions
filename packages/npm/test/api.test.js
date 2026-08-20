import assert from "node:assert/strict";
import test from "node:test";

import { load, years, latestYear, DivisionType, foldName } from "../dist/index.mjs";

test("سال‌های موجود", () => {
  assert.ok(years().includes(1404));
  assert.equal(latestYear(), Math.max(...years()));
});

test("۳۱ استان", () => {
  const ir = load(1404);
  assert.equal(ir.provinces().length, 31);
});

test("درخت از استان تا آبادی پیوسته است", () => {
  const ir = load(1404);
  const tehran = ir.search("تهران", { type: DivisionType.Province })[0];
  assert.ok(tehran);

  const county = ir.children(tehran.id, { type: DivisionType.County })[0];
  const district = ir.children(county.id, { type: DivisionType.District })[0];
  const rural = ir.children(district.id, { type: DivisionType.RuralDistrict })[0];
  assert.ok(rural, "بخش باید دهستان داشته باشد");

  const villages = ir.villages(rural.id);
  assert.ok(villages.length > 0);
  assert.equal(ir.parent(villages[0].id).id, rural.id);

  const path = ir.path(villages[0].id);
  assert.equal(path[0].type, DivisionType.Country);
  assert.equal(path.at(-1).id, villages[0].id);
});

test("issue #3 — شهر تکراری در یک بخش نیست", () => {
  const ir = load(1404);
  const seen = new Set();
  for (const city of ir.cities()) {
    const key = city.parentId + "/" + foldName(city.name);
    assert.ok(!seen.has(key), "شهر تکراری: " + city.name);
    seen.add(key);
  }
});

test("مناطق شهری زیر شهر پایه هستند، نه کنارش", () => {
  const ir = load(1404);
  const arak = ir.search("اراک", { type: DivisionType.City, exact: true })[0];
  assert.ok(arak);

  const zones = ir.urbanZones(arak.id);
  assert.equal(zones.length, 5);
  for (const z of zones) {
    assert.equal(z.type, DivisionType.UrbanZone);
    assert.equal(z.parentId, arak.id);
  }
  // «اراک» فقط یک بار به عنوان شهر در آن بخش می‌آید
  assert.equal(ir.cities(arak.parentId).filter((c) => foldName(c.name) === "اراک").length, 1);
});

test("هر گره غیر از کشور والد معتبر دارد", () => {
  const ir = load(1404).loadVillages();
  let checked = 0;
  for (const type of [1, 2, 3, 4, 5, 6, 7]) {
    for (const d of ir.byType(type)) {
      assert.ok(d.parentId != null, "بدون والد: " + d.name);
      assert.ok(ir.get(d.parentId), "والد گمشده: " + d.name);
      checked++;
    }
  }
  assert.ok(checked > 100000);
});

test("نام‌ها کاراکتر عربی ندارند", () => {
  const ir = load(1404).loadVillages();
  const bad = /[يكىةأإًٌٍَُِّْـ]/;
  for (const type of [1, 2, 3, 4, 5, 6, 7]) {
    for (const d of ir.byType(type)) {
      assert.ok(!bad.test(d.name), "کاراکتر غیراستاندارد در: " + d.name);
    }
  }
});

test("کد شهر و آبادی در کل کشور یکتاست", () => {
  const ir = load(1404).loadVillages();
  for (const types of [[DivisionType.City, DivisionType.UrbanZone], [DivisionType.Village]]) {
    const codes = new Set();
    for (const t of types) {
      for (const d of ir.byType(t)) {
        assert.ok(!codes.has(d.code), "کد تکراری: " + d.code + " / " + d.name);
        codes.add(d.code);
      }
    }
  }
});

test("جست‌وجو به ی و ک عربی و نیم‌فاصله حساس نیست", () => {
  const ir = load(1404);
  const a = ir.search("كرمانشاه", { type: DivisionType.Province });
  const b = ir.search("کرمانشاه", { type: DivisionType.Province });
  assert.equal(a.length, b.length);
  assert.ok(a.length > 0);
});
