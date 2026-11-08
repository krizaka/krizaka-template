import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { displayOf, fill, generate, optionsOf, targets, validate } from "./krizaka-template.mjs";

test("fill replaces both placeholders everywhere", () => {
  assert.equal(fill("__PRODUCT__ and __Product__ and __PRODUCT__", "demo", "Demo"), "demo and Demo and demo");
});

test("fill also replaces the forms Prettier writes in markdown prose", () => {
  assert.equal(fill("# **Product** site of **PRODUCT**", "demo", "Demo"), "# Demo site of demo");
});

test("validate refuses a bad slug and a bad display name", () => {
  assert.throws(() => validate("Bad-Slug", "Demo"), /slug/);
  assert.throws(() => validate("demo", 'a "quoted" name'), /display/);
  validate("demo", "Demo");
});

test("displayOf capitalises the slug", () => {
  assert.equal(displayOf("myproduct"), "Myproduct");
});

test("every target declares its options as data", () => {
  const found = targets();
  assert.ok(found.includes("web"), "web target exists");
  assert.ok(found.includes("desktop"), "desktop target exists");
  assert.ok(found.includes("mobile"), "mobile target exists");
  for (const t of found) {
    const options = optionsOf(t);
    assert.equal(typeof options.description, "string", `${t}: description`);
    assert.ok(Array.isArray(options.check) && options.check.length > 0, `${t}: check commands`);
    for (const command of options.check)
      assert.ok(Array.isArray(command) && command.length > 0, `${t}: a check command is argv`);
    assert.ok(Array.isArray(options.next) && options.next.length > 0, `${t}: next steps`);
    for (const extension of options.binaryExtensions)
      assert.ok(extension.startsWith("."), `${t}: extension ${extension}`);
  }
});

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), "krizaka-template-fixture-"));
  mkdirSync(join(root, "base", "deep"), { recursive: true });
  mkdirSync(join(root, "targets", "t1"), { recursive: true });
  writeFileSync(join(root, "base", "shared.txt"), "base of __Product__");
  writeFileSync(join(root, "base", "deep", "kept.txt"), "kept");
  writeFileSync(join(root, "base", "overridden.txt"), "from base");
  writeFileSync(join(root, "targets", "t1", "overridden.txt"), "from target __PRODUCT__");
  writeFileSync(join(root, "targets", "t1", "logo.png"), "__PRODUCT__ stays");
  writeFileSync(
    join(root, "targets", "t1", "template.json"),
    JSON.stringify({ description: "t1", binaryExtensions: [".png"], check: [["true"]], next: ["go"] }),
  );
  return root;
}

test("generate merges base and target, fills text files and skips binaries", () => {
  const root = fixtureRoot();
  const dir = mkdtempSync(join(tmpdir(), "krizaka-template-out-"));
  const { out } = generate({ slug: "demo", display: "Demo", target: "t1", dir, root });
  assert.equal(readFileSync(join(out, "shared.txt"), "utf8"), "base of Demo");
  assert.equal(readFileSync(join(out, "deep", "kept.txt"), "utf8"), "kept");
  assert.equal(readFileSync(join(out, "overridden.txt"), "utf8"), "from target demo", "the target wins on a conflict");
  assert.equal(readFileSync(join(out, "logo.png"), "utf8"), "__PRODUCT__ stays", "binary extensions are not filled");
  assert.ok(!existsSync(join(out, "template.json")), "the options file is not copied");
  assert.throws(() => generate({ slug: "demo", target: "t1", dir, root }), /already exists/);
});

test("generate refuses an unknown target", () => {
  const root = fixtureRoot();
  assert.throws(
    () => generate({ slug: "demo", target: "nope", dir: mkdtempSync(join(tmpdir(), "kt-")), root }),
    /unknown target/,
  );
});

for (const target of targets()) {
  test(`generate(${target}) leaves no placeholder in the project's package.json`, () => {
    const dir = mkdtempSync(join(tmpdir(), `krizaka-template-real-${target}-`));
    const { out } = generate({ slug: "sample", display: "Sample", target, dir });
    const manifest = readFileSync(join(out, "package.json"), "utf8");
    assert.ok(!manifest.includes("__PRODUCT__") && !manifest.includes("__Product__"), "placeholders are filled");
    assert.ok(existsSync(join(out, "LICENSE")), "the shared base ships the licence");
    assert.ok(!existsSync(join(out, "template.json")), "the options file stays in the template");
  });
}
