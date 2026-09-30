# Project documentation

This repository is the Mintlify documentation site for Nathan's ongoing projects. Use MDX pages with YAML frontmatter and docs.json navigation. Preserve the native Mintlify reading interface.

## Readers and structure

- Start every published page with `## Executive summary`, written for a human making a decision.
- Put detailed agent context below the summary: repositories, revisions, architecture, commands, automation boundaries, recovery, and evidence.
- Call the current app **Parkdex** and the old implementation **Legacy Parkdex**. `parkdex-kip` is an internal repository identifier. Kip is the mascot.
- Cover Parkdex, Legacy Parkdex, Bookhop, JEV hackathon, Networking CRM, Personal portfolio, and Screenshot to Issue. The extension's product name is Pindart.
- Never use em dashes.

## Evidence and accuracy

- Read inherited, workspace, repository, and relevant nested AGENTS.md files. Include operational troubleshooting where it applies and identify its source scope.
- Cross-check instructions against executable workflows, scripts, manifests, and current branch refs. Separate plans, historical release notes, verified configuration, and live provider observations.
- Pin GitHub source links to the inspected revision when possible. Label local-only evidence.
- Document branch-to-environment mappings per project. Do not assume every project has staging, uses the same providers, or automatically creates previews.
- State whether GitHub Actions, a PowerShell script, a provider integration, or an operator performs each deployment step.
- Describe APK and AAB distribution separately. A debug APK is not a signed Play release. Distinguish upload keys from Play app signing keys.
- Keep secret values, private keys, passwords, tokens, recovery material, private personal data, and raw provider responses out of published pages and Git history. Refer to variable names and secure retrieval procedures instead.

## Validation and delivery

Run content validation, Mintlify validation, and internal link checks. Verify deployed navigation, representative runbooks, Android release instructions, and responsive reading with the Chrome skill. Put cropped before/after evidence in the PR thread. Close task browser tabs when finished.

Mintlify's GitHub integration owns hosted builds when configured. Repository content checks do not publish the site. Confirm the connected branch and deployed URL before claiming a release is live.

Keep supporting research, CLI dependencies, temporary files, and the task ledger inside C:/repo/project-docs-workspace. Do not change source projects as a side effect of documenting them.
