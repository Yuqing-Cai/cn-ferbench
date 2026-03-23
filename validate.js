#!/usr/bin/env node

/**
 * cn-failure-atlas 分类体系验证脚本
 * 零外部依赖，使用 Node.js 内置模块
 *
 * 规则:
 *   R1 — JSON Schema 必填字段与类型检查
 *   R2 — total_labels 计数一致性
 *   R3 — 标签 ID 全局唯一
 *   R4 — derived_from 引用完整性
 *   R5 — subcategory ID 前缀匹配 layer ID
 *   R6 — Markdown ↔ JSON 标签同步
 *   R7 — tendency.primary_layer 引用有效层
 */

import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const ROOT = new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

// ─── data loading ──────────────────────────────────────────

function loadTaxonomy() {
  return JSON.parse(readFileSync(join(ROOT, "taxonomy.json"), "utf-8"));
}

function loadSchema() {
  return JSON.parse(readFileSync(join(ROOT, "taxonomy.schema.json"), "utf-8"));
}

function loadLayerMarkdowns() {
  const dir = join(ROOT, "layers");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const result = {};
  for (const f of files) {
    result[f] = readFileSync(join(dir, f), "utf-8");
  }
  return result;
}

// ─── helpers ───────────────────────────────────────────────

function collectAllLabels(taxonomy) {
  const labels = [];
  for (const layer of taxonomy.layers) {
    for (const sub of layer.subcategories) {
      for (const label of sub.labels) {
        labels.push({ ...label, layerId: layer.id, subcategoryId: sub.id });
      }
    }
  }
  return labels;
}

function collectAllIds(taxonomy) {
  const entries = [];
  for (const l of collectAllLabels(taxonomy)) {
    entries.push({ id: l.id, location: `Layer ${l.layerId} > ${l.subcategoryId}` });
  }
  for (const t of taxonomy.underlying_tendencies) {
    entries.push({ id: t.id, location: "underlying_tendencies" });
  }
  for (const c of taxonomy.cross_layer_tags) {
    entries.push({ id: c.id, location: "cross_layer_tags" });
  }
  return entries;
}

// ─── state ─────────────────────────────────────────────────

const errors = [];
const warnings = [];

function error(rule, msg) {
  errors.push(`  [${rule}] ${msg}`);
}
function warn(rule, msg) {
  warnings.push(`  [${rule}] ${msg}`);
}

// ─── R1: required fields & types ───────────────────────────

function checkRequiredFields(taxonomy, schema) {
  const RULE = "R1";

  // top-level required
  for (const key of schema.required || []) {
    if (!(key in taxonomy)) {
      error(RULE, `缺少顶层必填字段: ${key}`);
    }
  }

  // layer required fields
  const layerDef = schema.$defs?.layer;
  if (layerDef) {
    for (const [i, layer] of taxonomy.layers.entries()) {
      for (const key of layerDef.required || []) {
        if (!(key in layer)) {
          error(RULE, `layers[${i}] 缺少必填字段: ${key}`);
        }
      }
      // layer.id pattern
      if (layer.id && layerDef.properties?.id?.pattern) {
        const pat = new RegExp(layerDef.properties.id.pattern);
        if (!pat.test(layer.id)) {
          error(RULE, `layers[${i}].id "${layer.id}" 不匹配 pattern ${layerDef.properties.id.pattern}`);
        }
      }
    }
  }

  // label required fields & patterns
  const labelDef = schema.$defs?.label;
  if (labelDef) {
    for (const label of collectAllLabels(taxonomy)) {
      for (const key of labelDef.required || []) {
        if (!(key in label) || (key !== "derived_from" && label[key] === null)) {
          if (key === "derived_from") continue; // null is valid
          error(RULE, `标签 "${label.id}" (${label.layerId}) 缺少必填字段: ${key}`);
        }
      }
      // id pattern
      if (label.id && labelDef.properties?.id?.pattern) {
        const pat = new RegExp(labelDef.properties.id.pattern);
        if (!pat.test(label.id)) {
          error(RULE, `标签 ID "${label.id}" 不匹配 snake_case pattern`);
        }
      }
      // confidence_level enum
      if (labelDef.properties?.confidence_level?.enum) {
        const valid = labelDef.properties.confidence_level.enum;
        if (label.confidence_level && !valid.includes(label.confidence_level)) {
          error(RULE, `标签 "${label.id}" confidence_level "${label.confidence_level}" 不在 [${valid}] 中`);
        }
      }
      // criteria minItems
      if (label.criteria && label.criteria.length < 1) {
        error(RULE, `标签 "${label.id}" criteria 不能为空数组`);
      }
    }
  }

  // tendency required fields
  const tendencyDef = schema.$defs?.tendency;
  if (tendencyDef) {
    for (const [i, t] of taxonomy.underlying_tendencies.entries()) {
      for (const key of tendencyDef.required || []) {
        if (!(key in t)) {
          error(RULE, `underlying_tendencies[${i}] 缺少必填字段: ${key}`);
        }
      }
    }
  }

  // cross_layer_tag required fields
  const crossDef = schema.$defs?.cross_layer_tag;
  if (crossDef) {
    for (const [i, c] of taxonomy.cross_layer_tags.entries()) {
      for (const key of crossDef.required || []) {
        if (!(key in c)) {
          error(RULE, `cross_layer_tags[${i}] 缺少必填字段: ${key}`);
        }
      }
    }
  }

  // additionalProperties checks
  function checkExtra(obj, defn, path) {
    if (!defn || defn.additionalProperties !== false || !defn.properties) return;
    const allowed = new Set(Object.keys(defn.properties));
    for (const key of Object.keys(obj)) {
      if (!allowed.has(key)) {
        error(RULE, `${path} 存在多余字段: "${key}"（schema 不允许 additionalProperties）`);
      }
    }
  }

  // top-level
  checkExtra(taxonomy, schema, "taxonomy");
  // layers
  for (const [i, layer] of taxonomy.layers.entries()) {
    checkExtra(layer, layerDef, `layers[${i}]`);
    const subDef = schema.$defs?.subcategory;
    for (const [j, sub] of layer.subcategories.entries()) {
      checkExtra(sub, subDef, `layers[${i}].subcategories[${j}]`);
      for (const [k, label] of sub.labels.entries()) {
        // skip extra keys added by collectAllLabels
        checkExtra(label, labelDef, `标签 "${label.id}"`);
      }
    }
  }
  // tendencies
  for (const [i, t] of taxonomy.underlying_tendencies.entries()) {
    checkExtra(t, tendencyDef, `underlying_tendencies[${i}]`);
  }
  // cross_layer_tags
  for (const [i, c] of taxonomy.cross_layer_tags.entries()) {
    checkExtra(c, crossDef, `cross_layer_tags[${i}]`);
  }
}

// ─── R2: total_labels count ────────────────────────────────

function checkTotalLabels(taxonomy) {
  const RULE = "R2";
  const labels = collectAllLabels(taxonomy);
  const actual =
    labels.length +
    taxonomy.underlying_tendencies.length +
    taxonomy.cross_layer_tags.length;

  if (taxonomy.total_labels !== actual) {
    error(RULE, `total_labels 声明 ${taxonomy.total_labels}，实际 ${actual} (labels=${labels.length} + tendencies=${taxonomy.underlying_tendencies.length} + cross=${taxonomy.cross_layer_tags.length})`);
  }
}

// ─── R3: ID uniqueness ────────────────────────────────────

function checkIdUniqueness(taxonomy) {
  const RULE = "R3";
  const entries = collectAllIds(taxonomy);
  const seen = new Map();
  for (const { id, location } of entries) {
    if (seen.has(id)) {
      error(RULE, `ID 重复: "${id}" 出现在 ${seen.get(id)} 和 ${location}`);
    } else {
      seen.set(id, location);
    }
  }
}

// ─── R4: derived_from integrity ────────────────────────────

function checkDerivedFromIntegrity(taxonomy) {
  const RULE = "R4";
  const allIds = new Set(collectAllIds(taxonomy).map((e) => e.id));
  for (const label of collectAllLabels(taxonomy)) {
    if (label.derived_from === null) continue;
    if (!Array.isArray(label.derived_from)) {
      error(RULE, `标签 "${label.id}" derived_from 应为数组或 null，实际类型: ${typeof label.derived_from}`);
      continue;
    }
    if (label.derived_from.length === 0) {
      error(RULE, `标签 "${label.id}" derived_from 为空数组（应为 null 或非空数组）`);
      continue;
    }
    for (const parentId of label.derived_from) {
      if (parentId === label.id) {
        error(RULE, `标签 "${label.id}" derived_from 包含自引用`);
      } else if (!allIds.has(parentId)) {
        error(RULE, `标签 "${label.id}" derived_from 引用 "${parentId}" 不存在`);
      }
    }
  }
}

// ─── R5: subcategory ID prefix ─────────────────────────────

function checkSubcategoryPrefix(taxonomy) {
  const RULE = "R5";
  for (const layer of taxonomy.layers) {
    for (const sub of layer.subcategories) {
      if (!sub.id.startsWith(layer.id + "-")) {
        error(RULE, `subcategory "${sub.id}" 不以 "${layer.id}-" 开头（属于 layer "${layer.id}"）`);
      }
    }
  }
}

// ─── R6: Markdown ↔ JSON sync ──────────────────────────────

function checkMarkdownSync(taxonomy, markdowns) {
  const RULE = "R6";

  // Build layer number → md file mapping
  // layer-1-preconditions.md → "I", layer-2-... → "II", etc.
  const numToRoman = { "1": "I", "2": "II", "3": "III", "4": "IV", "5": "V" };

  for (const [filename, content] of Object.entries(markdowns)) {
    // skip cross-layer.md for label sync (it has tendencies + cross tags)
    if (filename === "cross-layer.md") continue;

    const match = filename.match(/^layer-(\d)/);
    if (!match) continue;
    const layerId = numToRoman[match[1]];
    if (!layerId) continue;

    const layer = taxonomy.layers.find((l) => l.id === layerId);
    if (!layer) {
      error(RULE, `${filename} 对应 layer "${layerId}" 但 taxonomy.json 中无此层`);
      continue;
    }

    // Collect JSON label IDs for this layer
    const jsonIds = new Set();
    for (const sub of layer.subcategories) {
      for (const label of sub.labels) {
        jsonIds.add(label.id);
      }
    }

    // Extract backtick-wrapped snake_case IDs from markdown
    const mdIds = new Set();
    const idPattern = /`([a-z][a-z0-9_]*)`/g;
    let m;
    while ((m = idPattern.exec(content)) !== null) {
      mdIds.add(m[1]);
    }

    // Also collect all known IDs (from all layers + tendencies + cross) for context
    const allKnownIds = new Set(collectAllIds(taxonomy).map((e) => e.id));

    // JSON has but MD doesn't mention → warning (might be new)
    for (const id of jsonIds) {
      if (!mdIds.has(id)) {
        warn(RULE, `${filename}: JSON 有但 MD 未提及 "${id}"`);
      }
    }

    // MD mentions but not in this layer's JSON → check if it's from another layer (ok) or nowhere (error)
    for (const id of mdIds) {
      if (!jsonIds.has(id) && !allKnownIds.has(id)) {
        error(RULE, `${filename}: MD 引用 "${id}" 但 taxonomy.json 中不存在`);
      }
    }
  }

  // Also check cross-layer.md for tendencies and cross_layer_tags
  const crossMd = markdowns["cross-layer.md"];
  if (crossMd) {
    const allKnownIds = new Set(collectAllIds(taxonomy).map((e) => e.id));
    const mdIds = new Set();
    const idPattern = /`([a-z][a-z0-9_]*)`/g;
    let m;
    while ((m = idPattern.exec(crossMd)) !== null) {
      mdIds.add(m[1]);
    }

    const crossJsonIds = new Set([
      ...taxonomy.underlying_tendencies.map((t) => t.id),
      ...taxonomy.cross_layer_tags.map((c) => c.id),
    ]);

    for (const id of crossJsonIds) {
      if (!mdIds.has(id)) {
        warn(RULE, `cross-layer.md: JSON 有但 MD 未提及 "${id}"`);
      }
    }

    for (const id of mdIds) {
      if (!allKnownIds.has(id)) {
        error(RULE, `cross-layer.md: MD 引用 "${id}" 但 taxonomy.json 中不存在`);
      }
    }
  }
}

// ─── R7: tendency primary_layer validity ───────────────────

function checkTendencyLayers(taxonomy) {
  const RULE = "R7";
  const validLayerIds = new Set(taxonomy.layers.map((l) => l.id));

  for (const t of taxonomy.underlying_tendencies) {
    // primary_layer can be "III" or "II-III" (range)
    const parts = t.primary_layer.split(/[–\-]/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!validLayerIds.has(trimmed)) {
        error(RULE, `tendency "${t.id}" primary_layer "${t.primary_layer}" 中 "${trimmed}" 不是有效层 ID`);
      }
    }
  }
}

// ─── report ────────────────────────────────────────────────

function report(taxonomy) {
  const rules = [
    ["R1", "JSON Schema 合规"],
    ["R2", `total_labels 计数一致 (${taxonomy.total_labels})`],
    ["R3", "标签 ID 全局唯一"],
    ["R4", "derived_from 引用完整"],
    ["R5", "subcategory ID 前缀匹配"],
    ["R6", "Markdown ↔ JSON 同步"],
    ["R7", "tendency primary_layer 有效"],
  ];

  console.log("");
  for (const [code, name] of rules) {
    const hasError = errors.some((e) => e.includes(`[${code}]`));
    const hasWarn = warnings.some((w) => w.includes(`[${code}]`));
    if (hasError) {
      console.log(`✗ ${code} ${name}`);
      errors.filter((e) => e.includes(`[${code}]`)).forEach((e) => console.log(e));
    } else if (hasWarn) {
      console.log(`⚠ ${code} ${name}`);
      warnings.filter((w) => w.includes(`[${code}]`)).forEach((w) => console.log(w));
    } else {
      console.log(`✓ ${code} ${name}`);
    }
  }

  console.log("");
  console.log(`结果: ${errors.length} error(s), ${warnings.length} warning(s)${errors.length > 0 ? " — 验证失败" : " — 验证通过"}`);
  console.log("");

  return errors.length > 0 ? 1 : 0;
}

// ─── main ──────────────────────────────────────────────────

function main() {
  const taxonomy = loadTaxonomy();
  const schema = loadSchema();
  const markdowns = loadLayerMarkdowns();

  checkRequiredFields(taxonomy, schema);
  checkTotalLabels(taxonomy);
  checkIdUniqueness(taxonomy);
  checkDerivedFromIntegrity(taxonomy);
  checkSubcategoryPrefix(taxonomy);
  checkMarkdownSync(taxonomy, markdowns);
  checkTendencyLayers(taxonomy);

  const exitCode = report(taxonomy);
  process.exit(exitCode);
}

main();
