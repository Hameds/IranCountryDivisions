"use strict";
/**
 * @hameds/iran-country-divisions
 * تقسیمات کشوری ایران — داده‌های مرکز آمار ایران
 *
 * بدون هیچ وابستگی. داده‌ها با تأخیر (lazy) از دیسک خوانده می‌شوند؛ آبادی‌ها
 * فقط وقتی بارگذاری می‌شوند که واقعاً درخواست شوند.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

/** انواع تقسیمات. عمق در درخت از زنجیره parentId گرفته می‌شود، نه از این عدد. */
const DivisionType = Object.freeze({
  Country: 0,
  Province: 1,
  County: 2,
  District: 3,
  RuralDistrict: 4,
  City: 5,
  Village: 6,
  UrbanZone: 7,
});

const DIVISION_TYPE_NAMES = Object.freeze({
  0: "کشور",
  1: "استان",
  2: "شهرستان",
  3: "بخش",
  4: "دهستان",
  5: "شهر",
  6: "آبادی",
  7: "منطقه شهری",
});

/** برای جست‌وجو: ی/ک عربی، اعراب، نیم‌فاصله، فاصله و ارقام فارسی را یکدست می‌کند. */
function foldName(s) {
  return String(s)
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ً-ْـ]/g, "")
    .replace(/[‌‎‏\s]/g, "")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** سال‌هایی که داده‌شان در این نسخه از پکیج موجود است. */
function years() {
  return fs
    .readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{4}$/.test(e.name))
    .map((e) => Number(e.name))
    .sort((a, b) => a - b);
}

/** جدیدترین سال موجود. */
function latestYear() {
  const y = years();
  return y[y.length - 1];
}

const cache = new Map();

/**
 * داده‌های یک سال را برمی‌گرداند. بدون آرگومان، جدیدترین سال.
 * فراخوانی دوم برای همان سال از کش برمی‌گردد.
 */
function load(year) {
  const y = year == null ? latestYear() : Number(year);
  if (cache.has(y)) return cache.get(y);

  const dir = path.join(DATA_DIR, String(y));
  if (!fs.existsSync(dir)) {
    throw new Error(
      "داده سال " + y + " در این پکیج نیست. سال‌های موجود: " + years().join("، ")
    );
  }

  const ds = new Divisions(y, dir);
  cache.set(y, ds);
  return ds;
}

function toDivision(row) {
  return {
    id: row[0],
    parentId: row[1],
    name: row[2],
    code: row[3],
    type: row[4],
    typeName: DIVISION_TYPE_NAMES[row[4]],
  };
}

class Divisions {
  constructor(year, dir) {
    this.year = year;
    this._dir = dir;
    this._byId = new Map();
    this._children = new Map();
    this._villagesLoaded = false;

    this._ingest(readJson(path.join(dir, "core.json")).rows);
  }

  _ingest(rows) {
    for (const row of rows) {
      const d = toDivision(row);
      this._byId.set(d.id, d);
      const p = d.parentId;
      if (p != null) {
        let list = this._children.get(p);
        if (!list) this._children.set(p, (list = []));
        list.push(d);
      }
    }
  }

  /**
   * آبادی‌ها را بارگذاری می‌کند (۹۹ هزار ردیف). بقیه متدها در صورت نیاز
   * خودشان این را صدا می‌زنند، پس معمولاً لازم نیست دستی فراخوانی شود.
   */
  loadVillages() {
    if (this._villagesLoaded) return this;
    this._ingest(readJson(path.join(this._dir, "villages.json")).rows);
    this._villagesLoaded = true;
    return this;
  }

  _needVillages(type) {
    if (type === DivisionType.Village || type == null) this.loadVillages();
  }

  /** یک محل با شناسه. */
  get(id) {
    const d = this._byId.get(id);
    if (d) return d;
    if (!this._villagesLoaded) {
      this.loadVillages();
      return this._byId.get(id);
    }
    return undefined;
  }

  /** والد مستقیم. */
  parent(id) {
    const d = this.get(id);
    return d && d.parentId != null ? this.get(d.parentId) : undefined;
  }

  /** زنجیره والدها از کشور تا والد مستقیم. */
  ancestors(id) {
    const out = [];
    let cur = this.parent(id);
    while (cur) {
      out.unshift(cur);
      cur = cur.parentId != null ? this.get(cur.parentId) : undefined;
    }
    return out;
  }

  /** مسیر کامل از کشور تا خود محل. */
  path(id) {
    const d = this.get(id);
    return d ? this.ancestors(id).concat([d]) : [];
  }

  /** فرزندان مستقیم. با options.type فقط یک نوع. */
  children(id, options) {
    const type = options && options.type;
    const parent = this._byId.get(id);
    // فرزندان دهستان آبادی هستند
    if (!this._villagesLoaded && (type === DivisionType.Village ||
        (type == null && parent && parent.type === DivisionType.RuralDistrict))) {
      this.loadVillages();
    }
    const list = this._children.get(id) || [];
    return type == null ? list.slice() : list.filter((d) => d.type === type);
  }

  /** ریشه درخت. */
  country() {
    return this.byType(DivisionType.Country)[0];
  }

  /** همه استان‌ها. */
  provinces() {
    return this.byType(DivisionType.Province);
  }

  /**
   * شهرها. مناطق شهری («تهران ۱»، «اراک ۳» و …) نوع جدا دارند و اینجا
   * نمی‌آیند؛ برای آن‌ها urbanZones را صدا بزنید.
   */
  cities(parentId) {
    return parentId == null
      ? this.byType(DivisionType.City)
      : this.children(parentId, { type: DivisionType.City });
  }

  /** مناطق شهری یک شهر، یا همه مناطق شهری کشور. */
  urbanZones(cityId) {
    return cityId == null
      ? this.byType(DivisionType.UrbanZone)
      : this.children(cityId, { type: DivisionType.UrbanZone });
  }

  /** آبادی‌های یک دهستان، یا همه آبادی‌های کشور. */
  villages(ruralDistrictId) {
    this.loadVillages();
    return ruralDistrictId == null
      ? this.byType(DivisionType.Village)
      : this.children(ruralDistrictId, { type: DivisionType.Village });
  }

  /** همه محل‌های یک نوع. */
  byType(type) {
    this._needVillages(type);
    const out = [];
    for (const d of this._byId.values()) if (d.type === type) out.push(d);
    return out;
  }

  /**
   * جست‌وجوی نام. ی و ک عربی، اعراب، فاصله و نیم‌فاصله نادیده گرفته می‌شوند.
   * options: { type, limit = 50, exact = false, within }
   *   within: شناسه‌ای که نتیجه باید زیرمجموعه آن باشد.
   */
  search(query, options) {
    const opts = options || {};
    const q = foldName(query);
    if (!q) return [];
    this._needVillages(opts.type);

    const limit = opts.limit == null ? 50 : opts.limit;
    const out = [];
    for (const d of this._byId.values()) {
      if (opts.type != null && d.type !== opts.type) continue;
      const name = foldName(d.name);
      if (opts.exact ? name !== q : name.indexOf(q) === -1) continue;
      if (opts.within != null && !this._isWithin(d, opts.within)) continue;
      out.push(d);
      if (limit > 0 && out.length >= limit) break;
    }
    return out;
  }

  _isWithin(node, ancestorId) {
    let cur = node;
    while (cur && cur.parentId != null) {
      if (cur.parentId === ancestorId) return true;
      cur = this._byId.get(cur.parentId);
    }
    return false;
  }

  /** کل زیردرخت یک محل به صورت تودرتو. */
  tree(id, options) {
    const maxType = options && options.maxType != null ? options.maxType : null;
    const root = this.get(id);
    if (!root) return undefined;
    const build = (node) => {
      const kids = this.children(node.id)
        .filter((k) => maxType == null || k.type <= maxType || k.type === DivisionType.UrbanZone)
        .map(build);
      return kids.length ? Object.assign({}, node, { children: kids }) : Object.assign({}, node);
    };
    return build(root);
  }

  /** تعداد هر نوع. */
  counts() {
    this.loadVillages();
    const out = {};
    for (const d of this._byId.values()) out[d.type] = (out[d.type] || 0) + 1;
    return out;
  }
}

module.exports = {
  DivisionType,
  DIVISION_TYPE_NAMES,
  Divisions,
  foldName,
  latestYear,
  load,
  years,
};
