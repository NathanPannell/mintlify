# Project handbook

Mintlify documentation for Parkdex, Legacy Parkdex, Bookhop, JEV hackathon, Networking CRM, Personal portfolio, and Screenshot to Issue (Pindart).

Every published page begins with a human-readable executive summary. Operational and agent context follows, including deployment ownership, source references, and verification limits.

## Local development

```powershell
npm ci
npm run check
npx mint validate
npx mint broken-links
npm run dev
```

Open the URL printed by Mintlify. CLI startup and the first preview download can take time. Search may require `mint login`.

## Publishing

The existing Mintlify project is connected to this repository's `main` branch. Open a PR, pass the content check, review the hosted Mintlify preview, then merge to publish. Check the built revision and verify the rendered site before reporting completion. The production site is https://pannell.mintlify.io/ and uses the existing Mintlify access controls.

The content check runs in GitHub Actions. Mintlify owns site builds and hosting. No application provider infrastructure is deployed by this repository.

## Editing

Read AGENTS.md. Add MDX pages to docs.json, start with an Executive summary, cite inspected revisions, and distinguish plans from current implementation. Never commit credentials. See operations/docs-maintenance.mdx for the full procedure.

Supporting research and delivery evidence are kept in the parent project workspace. The repository's .git file references separate Git metadata in that workspace.
