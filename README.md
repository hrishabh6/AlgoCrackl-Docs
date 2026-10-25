# AlgoCrack docs

Standalone documentation site for AlgoCrack `v1.0.0-rc.8`. It is its own Git repository. It does not build, deploy, or call the application cluster.

The site is a Next.js App Router app generated with Fumadocs. Pages are MDX. Search runs locally from the built content.

## Requirements

- Node.js 22 or newer
- pnpm 10.20.0 (`packageManager` in `package.json`; Corepack can provide it)

## Setup

```bash
corepack pnpm install
```

## Development

```bash
corepack pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Documentation lives under `/docs`.

## Checks

```bash
corepack pnpm lint
corepack pnpm types:check
corepack pnpm build
```

`pnpm build` compiles MDX, typechecks the release manifest, and produces the static search index. CI runs the same three commands from `.github/workflows/verify.yml`.

## Authoring

Write pages in `content/docs`. Read [Documentation conventions](content/docs/developer/authoring.mdx) before adding a page. In short:

- Frontmatter needs a title, description, audience, status, release, verification date, and source references.
- Put new pages in `meta.json`. Do not add an empty section.
- Record published images in `content/releases/<version>.json`. The schema is `lib/releases/schema.ts`.
- Do not commit secrets, tokens, exploit steps, or absolute paths on a developer machine.

Current pages:

| Page | Path |
| --- | --- |
| Introduction | `content/docs/index.mdx` |
| Features and Java support | `content/docs/using/features.mdx` |
| Architecture | `content/docs/architecture/overview.mdx` |
| Repository map | `content/docs/architecture/repositories.mdx` |
| RC.8 release | `content/docs/releases/v1.0.0-rc.8.mdx` |
| Authoring conventions | `content/docs/developer/authoring.mdx` |

## Git

Work happens on a dedicated branch, not by pushing this repository. The D1 branch is `docs/d1-platform`. Do not create a GitHub remote from this checkout unless that is a separate decision.

## Compatibility

The official generator initially selected TypeScript 7.0.2. `typescript-eslint` 8.72 cannot lint that compiler, so this project pins TypeScript 6.0.3. Next.js, Fumadocs UI, and Fumadocs MDX stay on the versions the generator selected (`next` 16.4.2, `fumadocs-core` 16.17.8, `fumadocs-mdx` 15.4.10). Mermaid diagrams use the `mermaid` package with `securityLevel: 'strict'`.
