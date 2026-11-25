#!/usr/bin/env node
import path from 'node:path';
import { createProject } from '../lib/create.js';
import { runDoctor, doctorProject } from '../lib/doctor.js';
import { HELP_TEXT } from '../lib/help.js';
import { getInfo } from '../lib/info.js';
import { resolvePortfolioRoot } from '../lib/resolve-root.js';
import { verifyProject } from '../lib/verify.js';

const entryFileUrl = import.meta.url;

function parseArgs(argv) {
  const args = [...argv];
  const globalOpts = { json: false, portfolioRoot: undefined, destPath: undefined };
  const positional = [];

  while (args.length > 0) {
    const a = args[0];
    if (a === '--json') {
      globalOpts.json = true;
      args.shift();
    } else if (a === '--portfolio-root') {
      globalOpts.portfolioRoot = args[1];
      args.shift();
      args.shift();
    } else if (a === '--path') {
      globalOpts.destPath = args[1];
      args.shift();
      args.shift();
    } else if (a.startsWith('-')) {
      throw new Error(`Unknown option: ${a}`);
    } else {
      positional.push(args.shift());
    }
  }

  return { globalOpts, positional };
}

function print(data, asJson) {
  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (typeof data === 'string') {
    console.log(data);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  const { globalOpts, positional } = parseArgs(process.argv.slice(2));
  const command = positional[0] || 'help';

  try {
    if (command === 'help' || command === '--help' || command === '-h') {
      print(HELP_TEXT, globalOpts.json);
      process.exitCode = 0;
      return;
    }

    const portfolioRoot = resolvePortfolioRoot({
      entryFileUrl,
      portfolioRootOverride: globalOpts.portfolioRoot,
    });

    if (command === 'info') {
      print(getInfo(portfolioRoot), globalOpts.json);
      return;
    }

    if (command === 'create') {
      const name = positional[1];
      if (!name) throw new Error('Usage: create <project-name> [--path <dir>]');
      const result = await createProject({
        portfolioRoot,
        projectName: name,
        destPath: globalOpts.destPath,
      });
      const human = [
        `Created project at: ${result.projectRoot}`,
        `Manifest: ${result.manifestPath}`,
        `Rules: ${result.summary.rules}, Skills: ${result.summary.skills}, References: ${result.summary.references}`,
        '',
        'Next steps:',
        '  1. cd into the project directory',
        '  2. git init (manual)',
        '  3. Fill docs/reference/project-context.md',
        '  4. Open folder in Cursor',
        '  5. Register in portfolio meta repo if needed',
      ].join('\n');
      print(globalOpts.json ? result : human, globalOpts.json);
      return;
    }

    if (command === 'verify') {
      const projectPath = positional[1]
        ? path.resolve(positional[1])
        : process.cwd();
      const report = await verifyProject(projectPath);
      if (globalOpts.json) {
        print(report, true);
      } else {
        print(
          [
            `Project: ${report.projectRoot}`,
            `Manifest valid: ${report.manifestValid}`,
            `OK: ${report.ok}`,
            `Missing required: ${report.missingRequired}`,
            `Locally modified: ${report.locallyModified}`,
            `Unchanged: ${report.unchanged}`,
          ].join('\n'),
          false,
        );
        for (const f of report.files) {
          if (f.status !== 'unchanged') {
            console.log(`  ${f.relativePath}: ${f.status}`);
          }
        }
      }
      process.exitCode = report.ok ? 0 : 1;
      return;
    }

    if (command === 'doctor') {
      const projectPath = positional[1];
      const { portfolioReport, projectReport } = await runDoctor({
        entryFileUrl,
        portfolioRootOverride: globalOpts.portfolioRoot,
        projectPath,
      });
      const combined = { portfolioRoot, portfolioReport, projectReport };
      if (globalOpts.json) {
        print(combined, true);
      } else {
        console.log(`Portfolio root: ${portfolioRoot}`);
        console.log(`Portfolio checks OK: ${portfolioReport.ok}`);
        if (portfolioReport.issues.length) {
          console.log('Issues:', portfolioReport.issues.join('; '));
        }
        if (portfolioReport.warnings.length) {
          console.log('Warnings:', portfolioReport.warnings.join('; '));
        }
        if (projectPath) {
          const pr = projectReport || (await doctorProject(path.resolve(projectPath)));
          console.log(`Project: ${pr.projectRoot}`);
          console.log(`Project checks OK: ${pr.ok}`);
          if (pr.issues.length) console.log('Project issues:', pr.issues.join('; '));
          if (pr.warnings.length) console.log('Project warnings:', pr.warnings.join('; '));
        }
      }
      const ok = portfolioReport.ok && (!projectReport || projectReport.ok);
      process.exitCode = ok ? 0 : 1;
      return;
    }

    throw new Error(`Unknown command: ${command}. Run help.`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (globalOpts.json) {
      print({ error: message }, true);
    } else {
      console.error(`Error: ${message}`);
    }
    process.exitCode = 1;
  }
}

await main();