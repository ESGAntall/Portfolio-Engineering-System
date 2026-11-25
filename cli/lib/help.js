import { CLI_VERSION } from './distribution-inventory.js';

export const HELP_TEXT = `Portfolio Local CLI v${CLI_VERSION}

Usage:
  node cli/bin/portfolio.js <command> [options]

Commands:
  create <name>     Bootstrap application repo from project-template + distribution bundle
  verify [path]     Check manifest and distributed files (local edits are informational)
  doctor [path]     Portfolio and/or project health checks
  info              CLI version, template version, distribution summary
  help              This message

Global options:
  --portfolio-root <path>   Override portfolio root (or set PORTFOLIO_ROOT)
  --path <dir>              Destination for create (default: <portfolio>/projects/<name>)
  --json                    Machine-readable output

Examples:
  node cli/bin/portfolio.js create my-app
  node cli/bin/portfolio.js create my-app --path "C:/Projects/my-app"
  node cli/bin/portfolio.js verify ./projects/my-app
  node cli/bin/portfolio.js doctor --path ./projects/my-app

Notes:
  - Does not run git init, push, or install dependencies.
  - Never overwrites existing files.
  - Git initialization remains manual.
`;