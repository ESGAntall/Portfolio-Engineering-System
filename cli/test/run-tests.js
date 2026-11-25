import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createProject } from '../lib/create.js';
import { verifyProject } from '../lib/verify.js';
import { doctorProject, doctorPortfolio } from '../lib/doctor.js';
import {
  scanPortfolioOnlyDependencies,
  isExclusionOrMetaOnlyLine,
} from '../lib/portfolio-only-scan.js';
import { readFile, mkdir } from 'node:fs/promises';
import { resolvePortfolioRoot } from '../lib/resolve-root.js';
import { validateProjectName } from '../lib/paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CLI_BIN = path.join(ROOT, 'cli', 'bin', 'portfolio.js');

/**
 * @param {string[]} args
 * @param {{ cwd?: string }} [opts]
 */
function runCli(args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CLI_BIN, ...args], {
      cwd: opts.cwd || ROOT,
      env: { ...process.env, PORTFOLIO_ROOT: ROOT },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d;
    });
    child.stderr.on('data', (d) => {
      stderr += d;
    });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    child.on('error', reject);
  });
}

async function tmpDir(prefix) {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), prefix));
}

test('resolve via portfolio.js entry file regardless of cwd', () => {
  const root = resolvePortfolioRoot({
    entryFileUrl: pathToFileURL(CLI_BIN).href,
    cwd: os.tmpdir(),
  });
  assert.equal(path.resolve(root), path.resolve(ROOT));
});

test('invalid project names rejected', () => {
  assert.equal(validateProjectName('../evil').valid, false);
  assert.equal(validateProjectName('ok-name').valid, true);
  assert.equal(validateProjectName('').valid, false);
});

test('default-style creation to temp path', async () => {
  const dest = await tmpDir('pes-create-');
  const name = 'tmpapp';
  await createProject({
    portfolioRoot: ROOT,
    projectName: name,
    destPath: dest,
  });
  assert.ok(fs.existsSync(path.join(dest, '.portfolio', 'manifest.json')));
  assert.ok(fs.existsSync(path.join(dest, '.cursor', 'rules', '00-portfolio-baseline.mdc')));
  assert.ok(fs.existsSync(path.join(dest, 'docs', 'reference', 'design-principles.md')));
  const v = await verifyProject(dest);
  assert.equal(v.ok, true);
  assert.equal(v.locallyModified, 0, 'manifest must not self-report locallyModified after create');
  await rm(dest, { recursive: true, force: true });
});

test('custom destination with spaces', async () => {
  const parent = await tmpDir('pes-space-');
  const dest = path.join(parent, 'my app');
  await createProject({ portfolioRoot: ROOT, projectName: 'spaceapp', destPath: dest });
  assert.ok(fs.existsSync(path.join(dest, '.cursor', 'skills', 'quality-gate', 'SKILL.md')));
  await rm(parent, { recursive: true, force: true });
});

test('CLI create from unrelated cwd', async () => {
  const dest = await tmpDir('pes-cwd-');
  const r = await runCli(['create', 'cwdtest', '--path', dest], { cwd: os.tmpdir() });
  assert.equal(r.code, 0, r.stderr || r.stdout);
  assert.ok(fs.existsSync(path.join(dest, '.portfolio', 'manifest.json')));
  await rm(dest, { recursive: true, force: true });
});

test('existing non-empty destination fails safely', async () => {
  const parent = await tmpDir('pes-nonempty-');
  await writeFile(path.join(parent, 'keep.txt'), 'user');
  await assert.rejects(
    () =>
      createProject({
        portfolioRoot: ROOT,
        projectName: 'blocked',
        destPath: parent,
      }),
    /non-empty|overwrite/i,
  );
  await rm(parent, { recursive: true, force: true });
});

test('existing empty destination allowed', async () => {
  const parent = await tmpDir('pes-empty-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'emptydest',
    destPath: parent,
  });
  assert.ok(fs.existsSync(path.join(parent, 'README.md')));
  await rm(parent, { recursive: true, force: true });
});

test('repeated create fails on same destination', async () => {
  const dest = await tmpDir('pes-repeat-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'once',
    destPath: dest,
  });
  await assert.rejects(
    () =>
      createProject({
        portfolioRoot: ROOT,
        projectName: 'twice',
        destPath: dest,
      }),
    /overwrite|non-empty/i,
  );
  await rm(dest, { recursive: true, force: true });
});

test('locally modified rule reported by verify', async () => {
  const dest = await tmpDir('pes-mod-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'modtest',
    destPath: dest,
  });
  const rule = path.join(dest, '.cursor', 'rules', '00-portfolio-baseline.mdc');
  await writeFile(rule, '# touched\n', 'utf8');
  const v = await verifyProject(dest);
  assert.equal(v.ok, true);
  assert.ok(v.locallyModified >= 1);
  await rm(dest, { recursive: true, force: true });
});

test('locally modified skill reported by verify', async () => {
  const dest = await tmpDir('pes-skillmod-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'skillmod',
    destPath: dest,
  });
  const skill = path.join(dest, '.cursor', 'skills', 'engineering-workflow', 'SKILL.md');
  await writeFile(skill, '# touched\n', 'utf8');
  const v = await verifyProject(dest);
  assert.equal(v.ok, true);
  assert.ok(v.locallyModified >= 1);
  await rm(dest, { recursive: true, force: true });
});

test('missing distributed file fails verify', async () => {
  const dest = await tmpDir('pes-miss-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'misstest',
    destPath: dest,
  });
  await rm(path.join(dest, '.cursor', 'rules', '30-quality-gates.mdc'));
  const v = await verifyProject(dest);
  assert.equal(v.ok, false);
  assert.ok(v.missingRequired >= 1);
  await rm(dest, { recursive: true, force: true });
});

test('invalid manifest fails verify', async () => {
  const dest = await tmpDir('pes-badman-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'badman',
    destPath: dest,
  });
  await writeFile(path.join(dest, '.portfolio', 'manifest.json'), '{"schemaVersion":99}', 'utf8');
  const v = await verifyProject(dest);
  assert.equal(v.ok, false);
  await rm(dest, { recursive: true, force: true });
});

test('missing manifest fails verify', async () => {
  const dest = await tmpDir('pes-noman-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'noman',
    destPath: dest,
  });
  await rm(path.join(dest, '.portfolio', 'manifest.json'));
  const v = await verifyProject(dest);
  assert.equal(v.ok, false);
  await rm(dest, { recursive: true, force: true });
});

test('doctor portfolio passes canonical layout', async () => {
  const d = await doctorPortfolio(ROOT);
  assert.equal(d.ok, true);
});

test('doctor project after create', async () => {
  const dest = await tmpDir('pes-doc-');
  await createProject({
    portfolioRoot: ROOT,
    projectName: 'doctest',
    destPath: dest,
  });
  const d = await doctorProject(dest);
  assert.equal(d.ok, true);
  await rm(dest, { recursive: true, force: true });
});

test('verify and doctor CLI exit codes', async () => {
  const dest = await tmpDir('pes-cli-v-');
  await runCli(['create', 'cliverify', '--path', dest]);
  const v = await runCli(['verify', dest]);
  assert.equal(v.code, 0, v.stderr);
  const doc = await runCli(['doctor', dest]);
  assert.equal(doc.code, 0, doc.stderr);
  await rm(dest, { recursive: true, force: true });
});

test('invalid project name via CLI', async () => {
  const parent = await tmpDir('pes-badcli-');
  const r = await runCli(['create', '../bad', '--path', parent]);
  assert.notEqual(r.code, 0);
  await rm(parent, { recursive: true, force: true });
});

test('path traversal project name rejected in library', async () => {
  const dest = await tmpDir('pes-trav-');
  await assert.rejects(
    () =>
      createProject({
        portfolioRoot: ROOT,
        projectName: '..',
        destPath: dest,
      }),
    /Project name/,
  );
  await rm(dest, { recursive: true, force: true });
});

test('create then verify: zero locallyModified', async () => {
  const dest = await tmpDir('pes-zero-mod-');
  await createProject({ portfolioRoot: ROOT, projectName: 'zeromod', destPath: dest });
  const v = await verifyProject(dest);
  assert.equal(v.ok, true);
  assert.equal(v.missingRequired, 0);
  assert.equal(v.locallyModified, 0);
  const m = JSON.parse(await readFile(path.join(dest, '.portfolio', 'manifest.json'), 'utf8'));
  assert.ok(!m.files.some((f) => f.relativePath === '.portfolio/manifest.json'));
  await rm(dest, { recursive: true, force: true });
});

test('portfolio doctor does not warn template reference README stub', async () => {
  const d = await doctorPortfolio(ROOT);
  assert.ok(!d.warnings.some((w) => w.includes('README.md') && w.includes('duplicate')));
});

test('portfolio doctor warns real policy duplicate in template', async () => {
  const fake = await tmpDir('pes-fake-port-');
  await writeFile(path.join(fake, '.portfolio-root'), '# marker\n');
  await mkdir(path.join(fake, 'portfolio'), { recursive: true });
  await writeFile(path.join(fake, 'portfolio', 'engineering-standards.md'), '# std\n');
  await mkdir(path.join(fake, '.cursor', 'skills', 'requirement-orchestrator'), { recursive: true });
  await writeFile(path.join(fake, '.cursor', 'skills', 'requirement-orchestrator', 'SKILL.md'), '# s\n');
  await mkdir(path.join(fake, 'docs', 'reference'), { recursive: true });
  await writeFile(path.join(fake, 'docs', 'reference', 'README.md'), '# c\n');
  await mkdir(path.join(fake, 'project-template', 'docs', 'reference'), { recursive: true });
  await writeFile(path.join(fake, 'project-template', 'docs', 'reference', 'README.md'), '# stub\n');
  await writeFile(
    path.join(fake, 'project-template', 'docs', 'reference', 'design-principles.md'),
    '# dupe\n',
  );
  const d = await doctorPortfolio(fake);
  assert.ok(
    d.warnings.some((w) => w.includes('design-principles.md')),
    d.warnings.join('; '),
  );
  await rm(fake, { recursive: true, force: true });
});

test('project doctor: no warn on distributed exclusion wording', async () => {
  const dest = await tmpDir('pes-doc-excl-');
  await createProject({ portfolioRoot: ROOT, projectName: 'docexcl', destPath: dest });
  const d = await doctorProject(dest);
  const portfolioOnly = d.warnings.filter((w) => w.includes('Portfolio-only dependency'));
  assert.equal(portfolioOnly.length, 0, portfolioOnly.join('\n'));
  await rm(dest, { recursive: true, force: true });
});

test('scan: exclusion lines for portfolio-design-system and rule 90', () => {
  assert.ok(
    isExclusionOrMetaOnlyLine(
      'Khi bootstrap: không rule 90, không `portfolio-design-system`.',
    ),
  );
  assert.ok(
    isExclusionOrMetaOnlyLine(
      'rule `90-portfolio-meta-local.mdc` — **không** áp dụng trong application repos.',
    ),
  );
  assert.equal(
    scanPortfolioOnlyDependencies(
      'Layout → `frontend-design`. Baseline meta → skill `portfolio-design-system` **chỉ** trong portfolio meta repo.',
    ).length,
    0,
  );
});

test('scan: detects real portfolio path dependency', () => {
  const findings = scanPortfolioOnlyDependencies(
    'Always read portfolio/design-principles.md before UI work.',
  );
  assert.ok(findings.some((f) => f.id === 'design-principles-source'));
});

test('scan: detects real portfolio-design-system activation', () => {
  const findings = scanPortfolioOnlyDependencies(
    'Skill gợi ý: `frontend-design`, `portfolio-design-system` for all UI.',
  );
  assert.ok(findings.some((f) => f.id === 'portfolio-design-system-dependency'));
});

test('scan: detects real rule 90 load dependency', () => {
  const findings = scanPortfolioOnlyDependencies(
    'You must load 90-portfolio-meta-local.mdc on every task in this repo.',
  );
  assert.ok(findings.some((f) => f.id === 'rule-90-dependency'));
});

test('template design-system README does not suggest meta-only skill as app dependency', async () => {
  const body = await readFile(
    path.join(ROOT, 'project-template', 'docs', 'design-system', 'README.md'),
    'utf8',
  );
  assert.ok(!/skill gợi ý:.*portfolio-design-system/i.test(body));
  const findings = scanPortfolioOnlyDependencies(body);
  assert.equal(findings.filter((f) => f.id === 'portfolio-design-system-dependency').length, 0);
});

test('doctor detects injected real dependency in temp project', async () => {
  const dest = await tmpDir('pes-bad-dep-');
  await createProject({ portfolioRoot: ROOT, projectName: 'baddep', destPath: dest });
  await writeFile(
    path.join(dest, '.cursor', 'rules', '98-evil.mdc'),
    'Use portfolio/engineering-standards.md and load 90-portfolio-meta-local.mdc always.\n',
  );
  const d = await doctorProject(dest);
  assert.ok(
    d.warnings.some((w) => w.includes('engineering-standards') || w.includes('rule-90')),
    d.warnings.join('; '),
  );
  await rm(dest, { recursive: true, force: true });
});

test('default projects path under portfolio root', async () => {
  const name = `pes-default-${Date.now()}`;
  const dest = path.join(ROOT, 'projects', name);
  try {
    await createProject({ portfolioRoot: ROOT, projectName: name });
    assert.ok(fs.existsSync(dest));
    await rm(dest, { recursive: true, force: true });
  } catch (e) {
    await rm(dest, { recursive: true, force: true }).catch(() => {});
    throw e;
  }
});