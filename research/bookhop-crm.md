# Bookhop and Networking CRM research

## Executive summary

Bookhop is a browser-only Vite prototype with no checked-in hosting target. Kinship, the Networking CRM, uses Neon and Vercel configuration plus an explicit PowerShell workflow for PR previews. The preview configuration's GitHub repository name differs from the local Git remote, and the documentation site's navigation still exposes only starter pages. The cloud IDs below are source or historical values, not a live provider inventory.

## Scope and snapshots

| Area | Reviewed source |
| --- | --- |
| Workspace guidance | `C:\repo\AGENTS.md` |
| Bookhop | `C:\repo\bookhop-workspace\bookhop`, commit `da49351593f971fdd67bbd07d44773c741d6e8d4`, local branch `master`, no Git remote |
| Networking CRM | `C:\repo\networking-crm-workspace\networking-crm`, commit `7f52e1caff285b752737e3c1d5e00dda2b621ca7`, local branch `main`, remote `https://github.com/NathanPannell/kinship.git` |
| Documentation site | `C:\repo\project-docs-workspace\project-docs`, branch `docs/ongoing-projects` at review time |

I read the target documentation repository's `AGENTS.md`, `docs.json`, README, and starter pages before authoring. Its style asks for active voice, second person, and concise sentence-case headings. I also read the generated application guidance at `networking-crm/AGENTS.md` and the installed dependency guidance at `networking-crm/node_modules/next/AGENTS.md`. The active tool catalog did not expose a Mintlify MCP server or Mintlify skill, so I used the repository's existing examples and wrote plain Markdown-compatible MDX. I did not install tools or edit files outside the requested allowlist.

## Bookhop findings

- `README.md` describes a mobile-first prototype with eight fictional libraries around Victoria.
- `package.json` and `vite.config.ts` show React, TypeScript, and Vite. The build command is `tsc -b && vite build`; there is no custom output directory, so Vite's default `dist/` applies.
- `src/progress.ts` persists visits, saved books, onboarding completion, and demo-day offset in browser `localStorage`.
- `src/ScanFlow.tsx` implements an illustrative scan flow with sample results. The README says photos remain in browser memory and there is no AI/OCR service or server.
- No project-specific `AGENTS.md`, `.github/workflows`, hosting manifest, Railway or Cloudflare config, or Git remote was found in the Bookhop source checkout.
- The top-level `C:\repo\AGENTS.md` requires work to remain in the canonical workspace and repository paths documented on the overview and deployment pages.

## Networking CRM findings

The repository's [`README.md`](https://github.com/NathanPannell/kinship/blob/7f52e1caff285b752737e3c1d5e00dda2b621ca7/README.md) describes Kinship's Google sign-in, Neon-backed contact data, LinkedIn CSV import, follow-up views, and account-scoped API tokens. [`vercel.json`](https://github.com/NathanPannell/kinship/blob/7f52e1caff285b752737e3c1d5e00dda2b621ca7/vercel.json) disables Git-triggered deployment.

The preview scripts and `scripts/preview-config.psd1` define these intended mappings:

| Resource | Value in source |
| --- | --- |
| GitHub repo expected by preview tooling | `NathanPannell/networking-crm` |
| Local Git origin | `https://github.com/NathanPannell/kinship.git` |
| Base and expected Vercel production branch | `main` |
| Vercel project | `networking-crm`, project ID `prj_XAoQDPZRzjK0NrqJQtwNRFOlybMN` |
| Vercel organization ID | `team_CJ0RWNsNJK6vDQy2raakV6cZ` |
| Neon project | `bold-math-31800795` |
| Neon production branch ID | `br-lively-bird-ak3aaqnt` |
| Neon schema-only preview parent branch ID | `br-ancient-sunset-akzc78m0` |

`preview-common.ps1` checks that the live Vercel project links to the repository hardcoded in preview config and that its production branch is `main`. The local remote name and hardcoded project name differ. A GitHub repository rename could cause the PR guards or linked-project identity check to reject preview creation. Confirm the intended canonical repository and update the source config and Vercel link through a separate approved code change before relying on the script.

`preview-pr.ps1` defaults to plan-only behavior. With `-Apply`, it validates a draft PR, tests the merge candidate and exact PR head, creates a schema-only Neon branch with a seven-day expiry, migrates a dedicated preview database, and performs an explicit Vercel preview deployment. The Vercel project and shared Preview environment variables must be empty. Browser verification remains a separate required step. `teardown-preview-pr.ps1` removes the exact recorded preview resources and marks cleanup complete only after three consecutive full-inventory absence observations.

No `.github/workflows` files are tracked at the reviewed source revision. A tracked historical task ledger, [`agent-create-contact.md`](https://github.com/NathanPannell/kinship/blob/7f52e1caff285b752737e3c1d5e00dda2b621ca7/.codex/task-ledgers/agent-create-contact.md), records a live audit with zero GitHub workflows and webhooks at that earlier time. Other pinned task ledgers record explicit production deployments, but the current source does not specify a canonical production deploy command. The project README advertises `https://kinship.nathanpannell.com`; an older task ledger also mentions `https://networking-crm-tau.vercel.app`. Confirm the active domain alias before using the generated Vercel URL as current. No Railway configuration or Cloudflare hosting configuration was found. `pg-cloudflare` in the lockfile is a database dependency, not evidence of a Cloudflare-hosted app.

## Deployment state and evidence limits

I did not query the Neon or Vercel APIs. The public-site open request was inaccessible through the available web tool. Therefore:

- IDs and branch relationships above describe checked-in configuration.
- The product domain is documented by the README and historical task notes, not freshly checked in Vercel.
- Local lifecycle journals at `C:\repo\networking-crm-workspace\preview-lifecycle\pr-3` and `...\pr-5` record historical successful cleanup on September 23, 2026, including completed absence observations for Neon and Vercel. They cannot establish current provider inventory.
- No claim is made that there are no active previews today.
- GitHub Actions and webhook state was recorded as empty in a historical task ledger. Current GitHub settings were not queried.

## Documentation-site constraints

The current `docs.json` identifies the site as Mintlify Starter Kit and lists only `index` and `quickstart` in its navigation. The requested scope allows writing project pages and the research note only, so this task did not alter `docs.json`. The six new MDX pages therefore need a separately authorized navigation update before they appear in the site's configured navigation.

## Files written

- `projects/bookhop/overview.mdx`
- `projects/bookhop/deployment.mdx`
- `projects/bookhop/troubleshooting.mdx`
- `projects/networking-crm/overview.mdx`
- `projects/networking-crm/deployment.mdx`
- `projects/networking-crm/troubleshooting.mdx`
- `research/bookhop-crm.md`
