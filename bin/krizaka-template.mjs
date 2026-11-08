#!/usr/bin/env node
// krizaka-template — generate a Krizaka product project from one shared base and one target.
//
//   krizaka-template new <slug> --target <target> [--display "<Product>"] [--dir <parent>]
//   krizaka-template prove <target> [--dir <parent>]
//   krizaka-template list
//
// `new` copies base/ then targets/<target>/ (the target wins on a conflict), fills the
// __PRODUCT__ / __Product__ placeholders in every text file, and prints the next steps.
// `prove` generates a sample project and runs the target's declared checks — the same
// command CI runs. A target's options are data in targets/<target>/template.json, never code here.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLACEHOLDER = { slug: "__PRODUCT__", display: "__Product__" };

export function targets(root = ROOT) {
  return readdirSync(join(root, "targets")).filter((t) => existsSync(join(root, "targets", t, "template.json")));
}

export function optionsOf(target, root = ROOT) {
  const file = join(root, "targets", target ?? "", "template.json");
  if (!existsSync(file)) throw new Error(`unknown target "${target}" — one of: ${targets(root).join(", ")}`);
  return JSON.parse(readFileSync(file, "utf8"));
}

export function validate(slug, display) {
  if (!/^[a-z][a-z0-9]{1,30}$/.test(slug ?? ""))
    throw new Error("slug: lowercase letters and digits, starting with a letter (e.g. myproduct)");
  if (!display || /[\n"\\]/.test(display)) throw new Error("display name: a short name without quotes");
}

export function displayOf(slug) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function fill(text, slug, display) {
  // Prettier normalises a standalone __…__ to **…** in markdown prose, so both spellings are the placeholder.
  return text
    .split(PLACEHOLDER.slug)
    .join(slug)
    .split(PLACEHOLDER.display)
    .join(display)
    .split("**PRODUCT**")
    .join(slug)
    .split("**Product**")
    .join(display);
}

export function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

export function generate({ slug, display = displayOf(slug ?? ""), target, dir = process.cwd(), root = ROOT }) {
  validate(slug, display);
  const options = optionsOf(target, root);
  const out = join(dir, slug);
  if (existsSync(out)) throw new Error(`${out} already exists`);
  cpSync(join(root, "base"), out, { recursive: true });
  cpSync(join(root, "targets", target), out, {
    recursive: true,
    filter: (source) => basename(source) !== "template.json",
  });
  const binary = new Set(options.binaryExtensions);
  let filled = 0;
  for (const file of walk(out)) {
    if (binary.has(extname(file))) continue;
    const text = readFileSync(file, "utf8");
    const next = fill(text, slug, display);
    if (next !== text) {
      writeFileSync(file, next);
      filled += 1;
    }
  }
  return { out, filled, options };
}

function run(command, cwd) {
  const result = spawnSync(command[0], command.slice(1), { cwd, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${command.join(" ")} failed in ${cwd}`);
}

export function prove(target, dir, root = ROOT) {
  const parent = dir ?? mkdtempSync(join(tmpdir(), `krizaka-template-${target}-`));
  const { out, options } = generate({ slug: "sample", display: "Sample", target, dir: parent, root });
  for (const command of options.check) run(command, out);
  return out;
}

const USAGE = `usage: krizaka-template <command>

  new <slug> --target <target> [--display "<Product>"] [--dir <parent>]
  prove <target> [--dir <parent>]
  list`;

function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (command === "list") {
    for (const t of targets()) console.log(`${t} — ${optionsOf(t).description}`);
    return;
  }
  if (command === "new") {
    const { values, positionals } = parseArgs({
      args: rest,
      allowPositionals: true,
      options: { target: { type: "string" }, display: { type: "string" }, dir: { type: "string" } },
    });
    const slug = positionals[0];
    if (!slug || !values.target) throw new Error(USAGE);
    const { out, filled, options } = generate({
      slug,
      display: values.display ?? displayOf(slug),
      target: values.target,
      dir: values.dir ? resolve(values.dir) : process.cwd(),
    });
    console.log(`${out} is ready (${filled} files filled). Next:`);
    for (const step of options.next) console.log(`  ${step}`);
    return;
  }
  if (command === "prove") {
    const { values, positionals } = parseArgs({
      args: rest,
      allowPositionals: true,
      options: { dir: { type: "string" } },
    });
    if (!positionals[0]) throw new Error(USAGE);
    const out = prove(positionals[0], values.dir ? resolve(values.dir) : undefined);
    console.log(`${positionals[0]}: checks green in ${out}`);
    return;
  }
  throw new Error(USAGE);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }
}
