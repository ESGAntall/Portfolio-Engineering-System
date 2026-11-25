/**
 * Heuristic scan for real portfolio-only dependencies in app project instructions.
 * Path references are high signal; skill/rule names require non-exclusion context.
 */

/** Undistributed paths — always a dependency if present. */
export const PORTFOLIO_PATH_PATTERNS = [
  { id: 'portfolio-registry', re: /\bportfolio\/portfolio-registry\.md\b/ },
  { id: 'engineering-standards', re: /\bportfolio\/engineering-standards\.md\b/ },
  { id: 'design-principles-source', re: /\bportfolio\/design-principles\.md\b/ },
  { id: 'project-specs', re: /\bportfolio\/project-specs\b/ },
  { id: 'meta-adr', re: /\bdocs\/decisions\/O-00[123]\b/ },
];

/**
 * @param {string} line
 */
export function isExclusionOrMetaOnlyLine(line) {
  return (
    /không phân phối/i.test(line) ||
    /không copy/i.test(line) ||
    /không rule 90/i.test(line) ||
    /portfolio meta only/i.test(line) ||
    /PORTFOLIO_ONLY/i.test(line) ||
    /chỉ trong portfolio meta/i.test(line) ||
    /chỉ.*trong.*meta repo/i.test(line) ||
    /không áp dụng trong application/i.test(line) ||
    /trừ.*portfolio-design-system/i.test(line) ||
    /Khi nào không kích hoạt/i.test(line) ||
    /\(không phân phối/i.test(line) ||
    /không skill này/i.test(line) ||
    /không dùng skill này/i.test(line) ||
    /— \*\*không\*\* áp dụng/i.test(line) ||
    /\*\*không\*\*.*`portfolio-design-system`/i.test(line) ||
    (/\bportfolio-design-system\b/.test(line) && /\bchỉ\b/i.test(line) && /meta/i.test(line)) ||
    (/\b90-portfolio-meta-local\.mdc\b/.test(line) &&
      (/không áp dụng/i.test(line) || /trong meta repo.*không/i.test(line)))
  );
}

/**
 * @param {string} line
 */
function isRealPortfolioDesignSystemDependency(line) {
  if (!/\bportfolio-design-system\b/.test(line)) return false;
  if (isExclusionOrMetaOnlyLine(line)) return false;
  return (
    /skill gợi ý\s*:/i.test(line) ||
    /→\s*`portfolio-design-system`/i.test(line) ||
    /\|\s*`portfolio-design-system`\s*\|/.test(line) ||
    /(?:use|dùng|route|activate|kích hoạt)\s+`portfolio-design-system`/i.test(line) ||
    /Skill:\s*`portfolio-design-system`/i.test(line)
  );
}

/**
 * @param {string} line
 */
function isRealRule90Dependency(line) {
  if (!/\b90-portfolio-meta-local\.mdc\b/.test(line)) return false;
  if (isExclusionOrMetaOnlyLine(line)) return false;
  return (
    /(?:load|apply|alwaysApply|bắt buộc|required|use)\s+.*90-portfolio-meta-local/i.test(line) ||
    /rule\s+90[^\n]*(?:bắt buộc|required)/i.test(line)
  );
}

/**
 * @param {string} content
 * @returns {{ id: string; detail: string }[]}
 */
export function scanPortfolioOnlyDependencies(content) {
  const findings = [];
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    if (isExclusionOrMetaOnlyLine(line)) continue;
    for (const { id, re } of PORTFOLIO_PATH_PATTERNS) {
      if (re.test(line)) {
        findings.push({ id, detail: line.trim().slice(0, 120) });
      }
    }
    if (isRealPortfolioDesignSystemDependency(line)) {
      findings.push({ id: 'portfolio-design-system-dependency', detail: line.trim().slice(0, 120) });
    }
    if (isRealRule90Dependency(line)) {
      findings.push({ id: 'rule-90-dependency', detail: line.trim().slice(0, 120) });
    }
  }
  return findings;
}