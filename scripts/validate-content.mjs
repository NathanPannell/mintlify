import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const docs = JSON.parse(readFileSync(path.join(root, 'docs.json'), 'utf8'));

function report(file, message) {
  errors.push(`${path.relative(root, file).replaceAll('\\', '/')}: ${message}`);
}

function mdxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'research') return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return mdxFiles(fullPath);
    return entry.name.endsWith('.mdx') ? [fullPath] : [];
  });
}

function localTarget(source, href) {
  const target = href.trim().replace(/^<|>$/g, '');
  if (!target || target.startsWith('#')) return null;
  if (/^(https?:|mailto:|tel:|data:)/i.test(target)) return null;
  if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(target)) {
    report(source, `unsafe link: ${target}`);
    return null;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(target.split(/[?#]/, 1)[0]);
  } catch {
    report(source, `invalid link encoding: ${target}`);
    return null;
  }
  if (pathname.includes('\\') || pathname.includes('\0')) {
    report(source, `unsafe link path: ${target}`);
    return null;
  }
  const resolved = pathname.startsWith('/')
    ? path.resolve(root, `.${pathname}`)
    : path.resolve(path.dirname(source), pathname);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    report(source, `link leaves the docs repository: ${target}`);
    return null;
  }
  return { resolved, target };
}

function existsAsPageOrAsset(resolved) {
  const candidates = [resolved, `${resolved}.mdx`, `${resolved}.md`, path.join(resolved, 'index.mdx')];
  return candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

function checkLinks(file, content) {
  const withoutFences = content.replace(/^\s*(```|~~~)[\s\S]*?^\s*\1[^\n]*$/gm, '');
  const targets = [];
  for (const match of withoutFences.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    targets.push(match[1]);
  }
  for (const match of withoutFences.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)) {
    targets.push(match[1]);
  }
  for (const href of targets) {
    const local = localTarget(file, href);
    if (local && !existsAsPageOrAsset(local.resolved)) {
      report(file, `missing local link target: ${local.target}`);
    }
  }
}

function navigationPages(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  if (Array.isArray(value.pages)) {
    for (const page of value.pages) {
      if (typeof page === 'string') found.push(page);
      else navigationPages(page, found);
    }
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== 'pages' && typeof child === 'object') {
      if (Array.isArray(child)) child.forEach((item) => navigationPages(item, found));
      else navigationPages(child, found);
    }
  }
  return found;
}

const pages = mdxFiles(root);
const navigated = navigationPages(docs.navigation);
const pageRoutes = new Set();
for (const route of navigated) {
  const target = localTarget(path.join(root, 'docs.json'), `/${route.replace(/^\//, '')}`);
  if (!target) continue;
  if (!existsAsPageOrAsset(target.resolved)) report(path.join(root, 'docs.json'), `missing navigation page: ${route}`);
  if (pageRoutes.has(route)) report(path.join(root, 'docs.json'), `duplicate navigation page: ${route}`);
  pageRoutes.add(route);
}

for (const file of pages) {
  const route = path.relative(root, file).replaceAll('\\', '/').replace(/\.mdx$/, '');
  if (!pageRoutes.has(route)) report(file, 'page is absent from navigation');

  const content = readFileSync(file, 'utf8');
  if (content.includes('—')) report(file, 'contains an em dash');
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const withoutFences = body.replace(/^\s*(```|~~~)[\s\S]*?^\s*\1[^\n]*$/gm, '');
  const firstHeading = withoutFences.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/m)?.[1];
  if (firstHeading?.toLowerCase() !== 'executive summary') {
    report(file, 'first heading must be "Executive summary"');
  }

  const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
    /\b(?:ghp_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9]{30,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
    /\bsk-[A-Za-z0-9_-]{20,}\b/,
  ];
  if (secretPatterns.some((pattern) => pattern.test(content))) report(file, 'contains a possible secret');
  checkLinks(file, content);
}

if (errors.length) {
  for (const error of errors) console.error(error);
  console.error(`\nContent validation failed with ${errors.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${pages.length} MDX pages and ${navigated.length} navigation entries.`);
}
