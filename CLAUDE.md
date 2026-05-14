# learn-graphql-in-2026

Scaffold for a live-coded GraphQL demo given as part of a conference talk. The demo
follows the "dream query" design technique: we start by writing the GraphQL query we
*wish* we could run, and then work backwards — designing the schema and implementing
resolvers to satisfy that query. Over the course of the talk, additional fields and
operations (queries and mutations) are layered on top.

The repo is intentionally minimal so the audience watches code being written, not
read. Bootstrapped files exist only where they would be a distraction to type live.

## Layout

This is an npm workspaces monorepo. Each top-level directory below is a workspace
unless noted otherwise.

- `graphql-server/` — The Apollo Server instance. This is where the demo's schema
  and resolvers live and where most live-coding happens.
  - `schema.graphql` — SDL. Starts with a placeholder `_empty` query; types and
    fields are added live as the dream query is decomposed.
  - `resolvers.ts` — Resolver map. Ships with `fetchFromService1` /
    `fetchFromService2` helpers so resolvers can call the upstream services
    without writing fetch boilerplate on stage.
  - `index.ts` — Server bootstrap, including an inline GraphiQL landing page.
    Stable; not expected to change during the talk.
  - Runs on `http://localhost:4000`.

- `service-1/`, `service-2/` — Tiny Express servers that act as fake upstream
  data sources for the GraphQL layer. Each one serves JSON fixtures out of its
  own `data/` directory: a file at `service-1/data/foo.json` is served at
  `GET http://localhost:3001/foo`. When we implement resolvers, they fetch from
  these services via the helpers in `graphql-server/resolvers.ts`. To add a new
  upstream resource during the talk, drop a JSON file into the appropriate
  `data/` directory — no code change needed in the service itself.
  - service-1 → `http://localhost:3001`
  - service-2 → `http://localhost:3002`

- `operations/` — Holds the `.graphql` files for the queries and mutations we
  author over the course of the talk (the "dream query" first, then refinements
  and new operations). Starts empty.

- `talk-intro/` — Static intro app used at the top of the talk. **Do not modify.**

- `slides/` — Presenterm slide deck (`presentation.md`) and assets. Out of scope
  for the demo itself.

## Running

From the repo root:

- `npm start` — Runs `service-1`, `service-2`, `graphql-server`, and `talk-intro`
  concurrently with color-coded prefixes. This is the normal mode for the talk.
- `npm run graphql-server` / `npm run service-1` / `npm run service-2` /
  `npm run intro` — Run an individual workspace.
- `npm run slides` — Open the slide deck in presenterm.

## Working notes for future sessions

- Keep changes scoped to whichever directory the user names. In particular,
  `talk-intro/` is off-limits unless the user explicitly says otherwise.
- When adding a new resolver that needs upstream data, prefer adding a JSON
  fixture under `service-1/data/` or `service-2/data/` and calling the existing
  `fetchFromService1` / `fetchFromService2` helper, rather than introducing a
  new data-fetching pattern.
- New operations the user writes during the talk belong as individual files in
  `operations/`.
